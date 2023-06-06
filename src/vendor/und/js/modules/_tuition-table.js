// Imports
const $               = require("jquery");
const log             = require("debug")("und:tuition-table");
const sortBy          = require("lodash.sortby");
const isObject        = require("lodash.isobject");
const isString        = require("lodash.isstring");
const { isUNDDomain } = require( '../util/_location' );

// Set defaults for online tables and single rate sheet
const yearDefault      = "2019/2020";
const residencyDefault = "ND";

$(".tuition-table").each(function(idx, tuitionTableNode) {

  // Variables
  let tuitPerCredit  = $(tuitionTableNode).find(".tuit-per-credit");
  let tuitPerYear    = $(tuitionTableNode).find(".tuit-per-year");
  let feePerCredit   = $(tuitionTableNode).find(".fee-per-credit");
  let feePerYear     = $(tuitionTableNode).find(".fee-per-year");
  let totalPerCredit = $(tuitionTableNode).find(".total-per-credit");
  let totalPerYear   = $(tuitionTableNode).find(".total-per-year");
  const dollar       = "$";

  const tuitionTextNote = $(tuitionTableNode).find(".tuition-table-note");
  const tuitionData     = {};

  let country;
  let countryName;
  let residency;
  let residencyName;
  let military      = 'null'; // NULL set to string to mimic data TYPE and VALUE from input.
  let degreeLevel   = $(tuitionTableNode).attr("data-degree-level");
  let programFormat = $(tuitionTableNode).attr("data-program-format");
  let program       = $(tuitionTableNode).attr("data-area-of-interest");
  let year;

  function getTuitionData({ file, year }) {
    return $.getJSON(file)
    .fail(err => {
      // log("error loading tuition JSON");
      // log(err);
    })
    .done(data => (tuitionData[year] = data));
  }

  function updateState() {
    const update = () => {
      const stateOpt = $(tuitionTableNode).find("select.state option:selected");

      residency = stateOpt.val();
      residencyName = stateOpt.text();
      residency = residency ? residency : residencyDefault;
    };
    update();
    $(tuitionTableNode)
    .find("select.state")
    .on("change", () => {
      update();
      calculateCosts();
    });
  }

  function updateYear() {
    year = $(tuitionTableNode)
    .find("input.radio__option:checked")
    .val();
    year = year ? year : yearDefault;
    $(tuitionTableNode)
    .find(".year-label")
    .on("click", function() {
      let radioLabel = $(this)
      .find("input")
      .val();
      year = radioLabel;
      calculateCosts();
    });
  }

  function calculateCosts() {

    $(tuitionTableNode).addClass("tuition-table--active");

    let creditCost;
    const creditCostParent = tuitionData[year].locations[degreeLevel];

    if (programFormat === "online") {
      if (residency === "international" || residency === "nonResidentCanadian") {
        creditCost = creditCostParent.online[program];
      }
      else {
        if (degreeLevel === "undergraduate") {
          if (military === "active") {
            if (program === "engineering" || program === "aerospace") {
              creditCost = creditCostParent.online[program];
            }
            else {
              creditCost = creditCostParent.online["military"];
            }
          }
          else {
            creditCost = creditCostParent.online[program];
          }
        }
        else {
          if (military != "null" && creditCostParent.online[program].discount != undefined) {
            creditCost = {
              perCredit: creditCostParent.online[program].discount,
              cap: creditCostParent.online[program].cap
            }
            log(creditCost)
          }
          else {
            creditCost = creditCostParent.online[program];
          }
        }
      }
    }
    else {
      if (residency === "international" || residency === "nonResidentCanadian") {
        creditCost = creditCostParent[residency][program];
      }
      else {
        if (degreeLevel === "undergraduate") {
          if (program === "aviation" || program === "engineering") {
            if (military === "active" || military === "vet") {
              creditCost = creditCostParent["ND"][program];
            }
            else {
              creditCost = creditCostParent[residency][program];
            }
          }
          else {
            if (military === "active") {
              creditCost = creditCostParent["ND"]["military"];
            }
            else if (military === "vet") {
              creditCost = creditCostParent["ND"][program];
            }
            else {
              creditCost = creditCostParent[residency][program];
            }
          }
        }

        else {
          if (military != "null") {
            creditCost = creditCostParent["ND"][program];
          }
          else {
            creditCost = creditCostParent[residency][program];
          }
        }
      }
    }

    if (creditCost != undefined) {
      // Fee cost per credit & year
      let programFeeFall = tuitionData[year].programFee[program].fall;
      let programFeeSpring = tuitionData[year].programFee[program].spring;
      let programFeeSpecial = tuitionData[year].programFee[program].special;
      let programFeeSpecialTotal = programFeeSpecial * 12;
      let programFeeSummer = tuitionData[year].programFee[program].summer;
      let programFee;
      let programFeeTotal;

      if (programFeeSpecial != undefined) {
        programFee = programFeeFall + programFeeSpecial;
        programFeeTotal =
        programFeeFall * 12 +
        programFeeSpring * 12 +
        programFeeSpecialTotal * 2;
      }
      else if (programFeeSummer != undefined) {
        programFee = programFeeSpring;
        programFeeTotal =
        programFeeFall * 12 +
        programFeeSpring * 12 +
        programFeeSummer;
      }
      else {
        programFee = programFeeSpring;
        programFeeTotal = programFeeFall * 12 + programFeeSpring * 12;
      }

      let calcFeePerCredit = programFee.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      });
      feePerCredit.text(dollar + calcFeePerCredit);

      let calcFeePerYear = programFeeTotal.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
      });
      feePerYear.text(dollar + calcFeePerYear);

      if (isObject(creditCost)) {
        let calcTuitPerCredit = creditCost.perCredit;
        let multiplier = creditCost.multiplier;

        if (multiplier === undefined) {
          multiplier = 2;
        }

        if (isString(calcTuitPerCredit)) {
          tuitPerCredit.text(calcTuitPerCredit);
          totalPerCredit.text(calcTuitPerCredit);
        }
        else {
          let calcTuitPerCreditConvert = calcTuitPerCredit.toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
          });
          tuitPerCredit.text(dollar + calcTuitPerCreditConvert);

          let calcTotalPerCredit = (
            calcTuitPerCredit + programFee
            ).toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            });
          totalPerCredit.text(dollar + calcTotalPerCredit);
        }

        let calcTuitPerYear = creditCost.cap;

        if (isString(calcTuitPerYear)) {
          tuitPerYear.text(calcTuitPerYear);
          totalPerYear.text(calcTuitPerYear);
        }
        else {
          let calcTuitPerAcademicYear = (calcTuitPerYear * multiplier).toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          });
          tuitPerYear.text(dollar + calcTuitPerAcademicYear);

          let calcTotalPerYear = (
            calcTuitPerYear * multiplier +
            programFeeTotal
            ).toLocaleString(undefined, {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2
            });

          totalPerYear.text(dollar + calcTotalPerYear);
        }
      }
      else {
        let calcTuitPerCredit = creditCost.toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        });

        tuitPerCredit.text(dollar + calcTuitPerCredit);

        let calcTuitPerYear = (creditCost * 24).toLocaleString(undefined, {
          maximumFractionDigits: 2,
          minimumFractionDigits: 2
        });

        tuitPerYear.text(dollar + calcTuitPerYear);

        let calcTotalPerCredit = (creditCost + programFee).toLocaleString(
          undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          });

        totalPerCredit.text(dollar + calcTotalPerCredit);

        let calcTotalPerYear = (
          creditCost * 24 +
          programFeeTotal
          ).toLocaleString(undefined, {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          });

        totalPerYear.text(dollar + calcTotalPerYear);
      }

      tuitionTextNote.html(
        tuitionData[year].programs[degreeLevel][programFormat][program].note
      );
    }
  }

  $(() => {
    if ($(".tuition-table").length > 0) {

      const paths = {
        production: 'https://und.edu/_resources/data/tuition-calculator/',
        localhost:  '../js/'
      };
      const fileLocation = paths[ isUNDDomain( window.location.hostname ) ? 'production' : 'localhost' ];

      Promise.resolve()
      .then(() =>
      getTuitionData({
        file: fileLocation + "tuition-2019-2020.json",
        year: "2019/2020"
      })
      )
      .then(() =>
      getTuitionData({
        file: fileLocation + "tuition-2020-2021.json",
        year: "2020/2021"
      })
      )
      .then(() => updateState())
      .then(() => updateYear())
      .then(() => calculateCosts());
    }
  });
});
