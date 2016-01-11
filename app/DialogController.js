((window, angular) => {

  "use strict";

  angular.module('app.controller.Dialog', [])
  .controller('DialogController', ($scope, $rootScope, $mdDialog) => {
    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    let tt_risk;
    let sum_risk = $rootScope.sumRisk;
    let tc = $rootScope.tc;

    $scope.msgRiskLevel = '';
    $scope.msgRiskType = '';
    $scope.msgRiskResolve = '';

    if (sum_risk[1] > 0) {

      tt_risk = (sum_risk[1] / sum_risk[3]).toFixed(1);
      $scope.totalRisk = (sum_risk[1] * 100).toFixed(2);

      if (tt_risk > 1.1) {
        $scope.msgRiskLevel = `ซึ่งระดับความเสี่ยงของท่านสูงเป็น ${String(tt_risk)} เท่า`;
      } else if (tt_risk < 0.9) {
        $scope.msgRiskLevel = `ซึ่งระดับความเสี่ยงของท่านต่ำเป็น ${String(tt_risk)} เท่า`;
      } else {
        $scope.msgRiskLevel = `ซึ่งใกล้เคียงกับระดับความเสี่ยง`;
      }

      //age[0], smoke[1], dm[2], sbp[3], sex[4], tc[5], ldl[6], hdl[7], whr[8], wc[9], height[10]
      //Group of risk and suggestion
      var sug = '';
      if (tc.smoke == 1) { sug = sug + ' เลิกสูบบุหรี่' }
      if (tc.dm == 1) { sug = sug + ' รักษาระดับน้ำตาลในเลือดให้อยู่ในเกณฑ์ปกติ' }
      if (tc.sbp >= 140) { sug = sug + ' ควบคุมระดับความดันโลหิตให้ดี' }
      if (tc.tc >= 220 || tc.ldl >= 190) { sug = sug + ' เข้ารับการรักษาเพื่อลดโคเรสเตอรอลในเลือด' }
      if ((tc.wc >= 38 && tc.sex == 1) || (tc.waist > 32 && tc.sex == 0)) { sug = sug + ' ลดน้ำหนักให้อยู่ในเกณฑ์ปกติ' }
      if (sum_risk[1] < 0.1) {
        $scope.msgRiskType = "จัดอยู่ในกลุ่มเสี่ยงน้อย";
        $scope.msgRiskResolve = "เพื่อป้องกันการเกิดโรคหลอดเลือดในอนาคต ควรออกกำลังกายอย่างสม่ำเสมอ รับประทานผักผลไม้เป็นประจำ" + sug + " และตรวจสุขภาพประจำปี"
      } else if (sum_risk[1] >= 0.1 && sum_risk[1] < 0.2) {
        $scope.msgRiskType = "จัดอยู่ในกลุ่มเสี่ยงปานกลาง";
        $scope.msgRiskResolve = "ควรออกกำลังกายอย่างสม่ำเสมอ รับประทานผักผลไม้เป็นประจำ" + sug + " และควรได้รับการตรวจร่างกายประจำปีอย่างสม่ำเสมอ";
      } else if (sum_risk[1] >= 0.2) {
        $scope.msgRiskType = "จัดอยู่ในกลุ่มเสี่ยงสูง";
        $scope.msgRiskResolve = "ควรเข้ารับคำปรึกษาจากแพทย์ ในเบื้องต้นควรออกกำลังกายอย่างสม่ำเสมอ รับประทานผักผลไม้เป็นประจำ" + sug + " และเข้ารับการตรวจสุขภาพประจำปีอย่างสม่ำเสมอ";
      } else {
        $scope.msgRiskType = "ไม่พบความเสี่ยง";
        $scope.msgRiskResolve = "สามารถป้องกันการเกิดโรคหลอดเลือดหัวใจในอนาคตได้ด้วยการออกกำลังกายอย่างสม่ำเสมอ";
      }
    }
  })
})(window, window.angular);