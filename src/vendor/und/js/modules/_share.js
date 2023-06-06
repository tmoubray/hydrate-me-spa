const $ = require("jquery");
const log = require("debug")("und:share");
const sample = require("lodash.sample");

if (
  window.location.href.indexOf("localhost") >= 0 ||
  window.location.href.indexOf("und.mstoner.com") >= 0
) {
  window.DEBUG = true;
}

const feedUrl =
  "//und.edu/_resources/includes-site/tint-content/main/social-home.cfm";

const imgPrefix = "http://und.edu";

function fixFeedItem(idx, itemNode) {
  const item = $(itemNode);
  const img = $(item).find("img");
  const link = $(item).find("a");

  const imgTag = $(item).find("img");
  const imgSrc = imgTag.attr("src");
  let imageUrl;
  if (window.DEBUG) {
    imageUrl = `${imgPrefix}${imgSrc}`;
  } else {
    imageUrl = imgSrc;
  }

  const linkUrl = $(link).attr("href");
  const classType = $(link)
    .attr("class")
    .split(" ");

  let target;
  if ($(link).attr("target") === "undefined") {
    target = $(link).attr("target", "_blank");
  } else {
    target = $(link).attr("target");
  }

  const spanTitle = $(link)
    .find("span")
    .attr("title");
  const spanText = $(link)
    .find("span")
    .text();
  const dataCTA = $(link).attr("data-cta-text");

  return {
    imageUrl,
    linkUrl,
    classType,
    target,
    spanTitle,
    spanText,
    dataCTA
  };
}

function groupFeedItems(acc, item) {
  item.classType.forEach(type => {
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
  });

  return acc;
}

function makeHalfBlock(card, idx) {
  const container = $("<a />");
  container.attr("href", card.linkUrl);
  container.attr("target", card.target);
  container.addClass("share__half");

  const imageWrap = $('<div class="share__half__img" />');

  const img = $("<img />");
  img.attr("src", card.imageUrl);

  const containerBottom = $("<div />");
  containerBottom.addClass("share__half__text");
  containerBottom.addClass("module--blackish");

  const text = $("<p />");
  text.text(card.spanText);

  const iconWrap = $('<span class="share__half__icon" />');
  const icon = $('<span class="share__icon__' + card.spanTitle + '" />');
  iconWrap.append(icon);

  container.append(imageWrap);
  container.append(containerBottom);
  containerBottom.append(text);
  containerBottom.append(iconWrap);
  imageWrap.append(img);
  return container;
}

function makePost(card, idx) {
  const container = $("<a />");
  container.addClass("share__img");
  container.attr("href", card.linkUrl);
  container.attr("target", card.target);

  const img = $("<img />");
  img.attr("src", card.imageUrl);

  const containerBottom = $("<div />");
  containerBottom.addClass("share__img__card");
  containerBottom.addClass("module--white");

  const text = $("<p />");
  text.text(card.spanText);

  const fakeLink = $("<span />");
  fakeLink.addClass("button--link");
  fakeLink.text(card.dataCTA);

  container.append(img);
  container.append(containerBottom);
  containerBottom.append(text);
  containerBottom.append(fakeLink);
  return container;
}

function makeImgBlock(card, idx) {
  const container = $("<a />");
  container.addClass("share__img");
  container.attr("href", card.linkUrl);
  container.attr("target", card.target);

  const img = $("<img />");
  img.attr("src", card.imageUrl);

  const hover = $('<span class="share__hover" />');
  hover.text(card.spanText);

  const gradient = $('<div class="share__img__gradient" />');
  const iconWrap = $('<span class="share__half__icon" />');
  const icon = $('<span class="share__icon__' + card.spanTitle + '" />');

  container.append(img);
  container.append(gradient);

  container.append(iconWrap);
  container.append(hover);
  iconWrap.append(icon);
  return container;
}

function makeTextBlock(card, idx) {
  const container = $("<a />");
  container.attr("href", card.linkUrl);
  container.attr("target", card.target);
  container.addClass("share__half--text");

  const containerBottom = $("<div />");
  containerBottom.addClass("share__full__text");
  containerBottom.addClass("module--blackish");

  const text = $("<p />");
  text.text(card.spanText);

  const iconWrap = $('<span class="share__half__icon" />');
  const icon = $('<span class="share__icon__' + card.spanTitle + '" />');
  iconWrap.append(icon);

  container.append(containerBottom);
  containerBottom.append(text);
  containerBottom.append(iconWrap);

  return container;
}

function addBlockOne(items) {
  if (items.length === 0) return;

  let cardItem;

  const unusedItems = items.filter(i => !i.used);

  const bigItem = sample(
    unusedItems.filter(item => item.classType.indexOf("tint-big") > 0)
  );

  const bigBackupItem = sample(
    unusedItems.filter(
      item =>
        item.classType.indexOf("tint-big-backup") >= 0 ||
        item.classType.indexOf("tint-post") >= 0
    )
  );

  const post = bigItem || bigBackupItem;
  post.used = true;

  if (post.classType.indexOf("tint-post") >= 0) {
    cardItem = makePost(post);
  } else {
    cardItem = makeImgBlock(post);
  }
  cardItem.appendTo(".grid-one");
}

function addBlockTwo(items) {
  if (items.length === 0) return;

  const stepOne = items.filter(i => !i.used);
  const half = sample(stepOne);
  half.used = true;

  let cardItem;
  if (half.classType.indexOf("tint-text-only") >= 0) {
    cardItem = makeTextBlock(half);
  } else {
    cardItem = makeHalfBlock(half);
  }
  cardItem.appendTo(".grid-two");
  setTimeout(() => {
    $(".grid-two").css({
      "-webkit-box-flex": "1 1 0",
      flex: "1 1 0"
    });
  }, 250);

  $(".grid-two > .share__half").addClass("share__half--swap");
}

function addBlockThree(items) {
  if (items.length === 0) return;
  const stepOne = items
    .filter(i => i.classType.indexOf("tint-text-only") === -1)
    .filter(i => !i.used);

  const block = sample(stepOne);
  block.used = true;

  const cardItem = makeImgBlock(block);

  cardItem.appendTo(".grid-three");
}

function addBlockFour(items) {
  if (items.length === 0) return;
  const stepOne = items
    .filter(i => i.classType.indexOf("tint-text-only") === -1)
    .filter(i => !i.used);
  const half = sample(stepOne);
  half.used = true;

  const cardItem = makeHalfBlock(half);

  setTimeout(() => {
    $(".grid-four").css({
      "-webkit-box-flex": "1 1 0",
      flex: "1 1 0"
    });
  }, 250);
  cardItem.appendTo(".grid-four");
}

function addBlockFive(items) {
  if (items.length === 0) return;
  const stepOne = items
    .filter(i => i.classType.indexOf("tint-text-only") === -1)
    .filter(i => !i.used);
  const block = sample(stepOne);
  block.used = true;
  const cardItem = makeImgBlock(block);
  cardItem.appendTo(".grid-five");
}

function addBlockSix(items) {
  if (items.length === 0) return;

  let cardItem;

  const unusedItems = items.filter(i => !i.used);

  const bigItem = sample(
    unusedItems.filter(item => item.classType.indexOf("tint-big") > 0)
  );

  const bigBackupItem = sample(
    unusedItems.filter(
      item =>
        item.classType.indexOf("tint-big-backup") >= 0 ||
        item.classType.indexOf("tint-post") >= 0
    )
  );

  const post = bigItem || bigBackupItem;
  post.used = true;

  if (post.classType.indexOf("tint-post") >= 0) {
    cardItem = makePost(post);
  } else {
    cardItem = makeImgBlock(post);
  }
  cardItem.appendTo(".grid-six");
}

$(() => {
  if ($(".share__bg--home").length > 0) {
    $.get(feedUrl).done(data => {
      const items = $(data)
        .filter("ul#tint-list")
        .children();

      const fixedItems = items.map(fixFeedItem).get();

      const groupedItems = fixedItems.reduce(groupFeedItems, {});

      const facebookItems = groupedItems["tint-facebook"];
      const postItems = groupedItems["tint-post"];
      const twitterItems = groupedItems["tint-twitter"];
      const instagramItems = groupedItems["tint-instagram"];

      log(groupedItems);

      addBlockOne(
        []
          .concat(facebookItems, postItems, twitterItems, instagramItems)
          .filter(i => i)
      );
      addBlockSix(
        []
          .concat(facebookItems, postItems, twitterItems, instagramItems)
          .filter(i => i)
      );
      addBlockTwo(
        [].concat(facebookItems, twitterItems, instagramItems).filter(i => i)
      );
      addBlockThree(
        [].concat(facebookItems, twitterItems, instagramItems).filter(i => i)
      );
      addBlockFour(
        [].concat(facebookItems, twitterItems, instagramItems).filter(i => i)
      );
      addBlockFive(
        [].concat(facebookItems, twitterItems, instagramItems).filter(i => i)
      );
    });
  }
});
