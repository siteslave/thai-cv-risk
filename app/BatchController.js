((window, angular) => {
  "use strict";

  const ipcRenderer = require('electron').ipcRenderer;
  const fs = require('fs');
  const path = require('path');
  const _ = require('lodash');

  angular.module('app.controller.Batch', [])
    .controller('BatchController', ($scope, $mdDialog, ThaiCvRisk) => {

      $scope.fileName = '';

      $scope.openFile = () => {
        let file = ipcRenderer.sendSync('open-file');
        $scope.trueFileName = file;

        $scope.fileName = path.basename(file);
      };

      $scope.process = () => {
        if ($scope.fileName) {
          console.log($scope.trueFileName[0]);
          ThaiCvRisk.toJson($scope.trueFileName[0])
          .then((data) => {
            //console.log(data);
            let risks = [];
            if (_.size(data)) {
              _.forEach(data, (v) => {
                // HN|NAME|AGE|SEX|DM|SMOKE|SBP|TCL|LDL|HDL|WAIST|HEIGHT
                let tc = {};
                tc.hn = v.HN;
                tc.name = v.NAME;
                tc.age = parseInt(v.AGE);
                tc.sexName = v.SEX == '1' ? 'ชาย' : v.SEX == '0' ? 'หญิง' : 'ไม่ทราบ';
                tc.sex = parseInt(v.SEX);
                tc.smoke = parseInt(v.SMOKE);
                tc.dm = parseInt(v.DM);
                tc.sbp = parseFloat(v.SBP);
                tc.tc = parseFloat(v.TCL);
                tc.ldl = parseFloat(v.LDL);
                tc.hdl = parseFloat(v.HDL);
                tc.whr = 0;
                tc.wc = parseFloat(v.WAIST) * 2.5;
                tc.height = parseFloat(v.HEIGHT);

                if (tc.wc > 0 && tc.height > 0) { tc.whr = tc.wc / tc.height }

                if (!tc.tc || !tc.ldl || !tc.hdl) {
                  tc.tc = 0;
                  tc.ldl = 0;
                  tc.hdl = 0;
                } else {
                  tc.waist = 0;
                  tc.height = 0;
                  tc.whr = 0;
                }

                tc.risk = ThaiCvRisk.doCalculate(
                  tc.age, tc.smoke, tc.dm, tc.sbp, tc.sex,
                  tc.tc, tc.ldl, tc.hdl, tc.whr, tc.waist
                );

                  tc.score = tc.risk[1] * 100;

                //age[0], smoke[1], dm[2], sbp[3], sex[4], tc[5], ldl[6], hdl[7], whr[8], wc[9], height[10]
                //Group of risk and suggestion
                var sug = '';
                if (tc.smoke == 1) { sug = sug + ' เลิกสูบบุหรี่' }
                if (tc.dm == 1) { sug = sug + ' รักษาระดับน้ำตาลในเลือดให้อยู่ในเกณฑ์ปกติ' }
                if (tc.sbp >= 140) { sug = sug + ' ควบคุมระดับความดันโลหิตให้ดี' }
                if (tc.tc >= 220 || tc.ldl >= 190) { sug = sug + ' เข้ารับการรักษาเพื่อลดโคเรสเตอรอลในเลือด' }
                if ((tc.wc >= 38 && tc.sex == 1) || (tc.waist > 32 && tc.sex == 0)) { sug = sug + ' ลดน้ำหนักให้อยู่ในเกณฑ์ปกติ' }
                if (tc.risk[1] < 0.1) {
                  tc.level = "เสี่ยงน้อย";
                  tc.resolve = "เพื่อป้องกันการเกิดโรคหลอดเลือดในอนาคต ควรออกกำลังกายอย่างสม่ำเสมอ รับประทานผักผลไม้เป็นประจำ" + sug + " และตรวจสุขภาพประจำปี"
                } else if (tc.risk[1] >= 0.1 && tc.risk[1] < 0.2) {
                  tc.level = "เสี่ยงปานกลาง";
                  tc.resolve = "ควรออกกำลังกายอย่างสม่ำเสมอ รับประทานผักผลไม้เป็นประจำ" + sug + " และควรได้รับการตรวจร่างกายประจำปีอย่างสม่ำเสมอ";
                } else if (tc.risk[1] >= 0.2) {
                  tc.level = "เสี่ยงสูง";
                  tc.resolve = "ควรเข้ารับคำปรึกษาจากแพทย์ ในเบื้องต้นควรออกกำลังกายอย่างสม่ำเสมอ รับประทานผักผลไม้เป็นประจำ" + sug + " และเข้ารับการตรวจสุขภาพประจำปีอย่างสม่ำเสมอ";
                } else {
                  tc.level = "ไม่พบความเสี่ยง";
                  tc.resolve = "สามารถป้องกันการเกิดโรคหลอดเลือดหัวใจในอนาคตได้ด้วยการออกกำลังกายอย่างสม่ำเสมอ";
                }

                risks.push(tc);

              });

              $scope.risks = risks;

            } else {
              // No record
            }


          }, (err) => {
            console.log('Error: ' + err)
          })
        } else {
          // file not found!
        }
      }

    })
})(window, window.angular);