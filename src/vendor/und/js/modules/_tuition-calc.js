/**
 * Tuition Calculator
 * -----------------------------------------------------------------------------
 */

// Imports
const $ = require("jquery");
const log = require("debug")("und:tuition-calc");
const sortBy = require("lodash.sortby");
const isObject = require("lodash.isobject");
const isString = require("lodash.isstring");
const animateTo = require("../util/_animate-to");
const { isUNDDomain } = require("../util/_location");

// Variables
let tuitPerCredit = $(".tuit-per-credit");
let tuitPerYear = $(".tuit-per-year");
let feePerCredit = $(".fee-per-credit");
let feePerYear = $(".fee-per-year");
let totalPerCredit = $(".total-per-credit");
let totalPerYear = $(".total-per-year");
const dollar = "$";

const areaOfInterestSelect = $("select#area-of-interest");
const stateSelect = $("select#state");
const tuitionClassHeader = $("p.tuition-calc__heading__result");
const tuitionTextNote = $(".tuition-calc-note");
const tuitionData = {};

let country;
let countryName;
let residency;
let residencyName;
let military;
let militaryName;
let degreeLevel;
let degreeLevelName;
let programFormat;
let programFormatName;
let program;
let programName;
let year;

function getTuitionData({ file, year }) {
  return $.getJSON(file)
    .fail(err => {
      // log("eror loading tuition JSON");
      // log(err);
    })
    .done(data => (tuitionData[year] = data));
}

function setStateSelectionForUsa() {
  stateSelect.parent().show();
  stateSelect.empty();
  stateSelect
    .parent()
    .find(".form__select__text")
    .text("North Dakota");
  stateSelect.append($('<option value="ND">North Dakota</option>'));
  stateSelect.append($('<option value="MN">Minnesota</option>'));
  stateSelect.append($('<option value="nonResident">Other US State</option>'));
  updateState();
}

function setStateSelectionForCanada() {
  stateSelect.parent().show();
  stateSelect.empty();
  stateSelect
    .parent()
    .find(".form__select__text")
    .text("Manitoba");
  stateSelect.append($('<option value="nonResidentCanadian">Manitoba</option>'));
  stateSelect.append($('<option value="nonResidentCanadian">Saskatchewan</option>'));
  stateSelect.append(
    $('<option value="international">Other Canadian Province</option>')
  );
  updateState();
}

function setStateSelectionForIntl() {
  stateSelect.parent().hide();
}

function updateCountry() {
  const update = () => {
    const countryOpt = $("select#country option:selected");
    country = countryOpt.val();
    countryName = countryOpt.text();

    if (country === "usa") setStateSelectionForUsa();
    else if (country === "canada") setStateSelectionForCanada();
    else if (country === "international") {
      residency = "international";
      residencyName = "International";
      setStateSelectionForIntl();
    } else log(`Error: Invalid country "${countryName}" selected`);
  };

  update();
  $("select#country").on("change", () => {
    update();
    filterSelection();
  });
}

function updateState() {
  const update = () => {
    const stateOpt = $("select#state option:selected");
    residency = stateOpt.val();
    residencyName = stateOpt.text();
  };

  update();
  $("select#state").on("change", () => {
    update();
    filterSelection();
  });
}

function updateMilitary() {
  military = $("input[name=military]:checked").val();
  militaryName = $("input[name=military]:checked").attr("data-name");

  $(".military-label").on("click", function() {
    let radioLabel = $(this)
      .find("input")
      .val();
    military = radioLabel;

    let radioLabelName = $(this)
      .find("input")
      .attr("data-name");
    militaryName = radioLabelName;
    filterSelection();
  });
}

function updateDegreeLevel() {
  degreeLevel = $("input[name=degree-level]:checked").val();
  degreeLevelName = $("input[name=degree-level]:checked").attr("data-name");

  $(".degree-label").on("click", function() {
    let radioLabel = $(this)
      .find("input")
      .val();
    degreeLevel = radioLabel;

    let radioLabelName = $(this)
      .find("input")
      .attr("data-name");
    degreeLevelName = radioLabelName;

    const online = $("label[for=online]");
    const onCampus = $("label[for=on-campus]");

    if (degreeLevel === "professional") {
      online.hide();
      onCampus.click();

    } else {
      online.show();
    }
    filterSelection();
  });
}

function updateProgramFormat() {
  programFormat = $("input[name=program-format]:checked").val();
  programFormatName = $("input[name=program-format]:checked").attr("data-name");

  $(".program-label").on("click", function() {
    let radioLabel = $(this)
      .find("input")
      .val();
    programFormat = radioLabel;

    let radioLabelName = $(this)
      .find("input")
      .attr("data-name");
    programFormatName = radioLabelName;
    filterSelection();
  });
}

function updateProgram() {
  const update = () => {
    const opt = areaOfInterestSelect.find(":selected");
    program = opt.val();
    programName = opt.text();
  };

  update();
  areaOfInterestSelect.on("change", () => {
    update();
  });
}

function updateYear() {
  year = $("input[name=year]:checked").val();

  $(".year-label").on("click", function() {
    let radioLabel = $(this)
      .find("input")
      .val();
    year = radioLabel;
    filterSelection();
  });
}

function filterSelection() {
  const programs = tuitionData[year].programs[degreeLevel][programFormat];

  areaOfInterestSelect.empty();
  areaOfInterestSelect.append(
    $('<option value="undefined">Select area of interest</option>')
  );
  updateProgram();

  const allInterests = [];
  Object.keys(programs).forEach(programName => {
    const interests = programs[programName].title;

    interests.forEach(interest => {
      allInterests.push({
        name: interest,
        programName
      });
    });
  });

  const sortedInterests = sortBy(allInterests, "name");

  sortedInterests.forEach(({ name, programName }) => {
    const opt = $("<option />");
    opt.attr("value", programName);
    opt.text(name);
    areaOfInterestSelect.append(opt);
  });
}

function calculateCosts() {
  $(".tuition-calc__button").on("click", () => {

    const msg = `${residencyName}, ${militaryName}, ${degreeLevelName}, ${programFormatName}, ${year}, ${programName}`;
    const userAlertMessage = "You must choose an Area of Interest.";

    tuitionClassHeader.text(msg);

    let creditCost;
    const creditCostParent = tuitionData[year].locations[degreeLevel];

    const checkInterest = areaOfInterestSelect.find("option:selected").val();

    if (checkInterest === "undefined") {
      alert(userAlertMessage);
    }
    else {
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
    }

    if (creditCost != undefined) {
      $(".tuition-calc").addClass("tuition-calc--active");
      animateTo($(".tuition-calc--result")[0]);

      let programFeeFall = tuitionData[year].programFee[program].fall;
      let programFeeSpring = tuitionData[year].programFee[program].spring;
      let programFeeSpecial = tuitionData[year].programFee[program].special;
      let programFeeSpecialTotal = programFeeSpecial * 2;

      let programFeeSummer = tuitionData[year].programFee[program].summer;
      let programFee;
      let programFeeTotal;

      if (programFeeSpecial != undefined) {
        programFee = programFeeSpring + programFeeSpecial;
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
  });
}

$(() => {
  if ($(".tuition-calc").length > 0) {
    const paths = {
      production: "https://und.edu/_resources/data/tuition-calculator/",
      localhost: "../js/"
    };
    const fileLocation =
      paths[isUNDDomain(window.location.hostname) ? "production" : "localhost"];

    Promise.resolve()
      .then(() =>
        getTuitionData({
          file: fileLocation + "tuition-2020-2021.json",
          year: "2020/2021"
        })
      ).catch((error) => {
        // log('error fetching 2020/2021')
      })
      .then(() => updateMilitary())
      .then(() => updateDegreeLevel())
      .then(() => updateProgramFormat())
      .then(() => updateProgram())
      .then(() => updateYear())
      .then(() => updateCountry())
      .then(() => filterSelection())
      .then(() => calculateCosts());
  }
});
