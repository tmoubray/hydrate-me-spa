const $ = require("jquery");
const log = require("debug")("und:college");
const sample = require("lodash.sample");

let captionTrim;

function trimCaption(captionText, length) {
  const captionTrim = $.trim(captionText).substring(0, length);
  if (captionTrim.length < captionText.length) {
    return captionTrim + "...";
  } else {
    return captionTrim;
  }
}

function buildBlockOne(results) {
  if (results.length === 0) return;

  const stepOne = results.filter(i => !i.used);
  const post = sample(stepOne);
  const url = post.indexUrl;
  const imgUrl = post.metaData.I.split("|")[0];

  const caption = post.metaData.c;
  const newCaption = trimCaption(caption, 200);

  post.used = true;

  log("Block One");
  log(post);

  const container = $("<a />");

  container.addClass("share__img");
  container.attr("href", url);
  container.attr("target", "_blank");

  const img = $("<img />");
  img.attr("src", imgUrl);

  const hover = $('<span class="share__hover" />');
  hover.text(newCaption);

  const gradient = $('<div class="share__img__gradient" />');
  const iconWrap = $('<span class="share__half__icon" />');

  let icon;
  if (url.indexOf("youtube.com") > -1) {
    icon = $('<span class="share__icon__Youtube" />');
  } else if (url.indexOf("instagram.com") > -1) {
    icon = $('<span class="share__icon__Instagram" />');
  } else if (url.indexOf("twitter.com") > -1) {
    icon = $('<span class="share__icon__Twitter" />');
  }

  container.append(img);
  container.append(gradient);
  container.append(iconWrap);
  container.append(hover);
  iconWrap.append(icon);

  $(".grid-one").append(container);
}

function buildBlockTwo(results) {
  if (results.length === 0) return;
  const stepOne = results.filter(i => !i.used);
  const post = sample(stepOne);
  const url = post.indexUrl;
  const imgUrl = post.metaData.I.split("|")[0];

  const caption = post.metaData.c;
  const newCaption = trimCaption(caption, 200);

  post.used = true;

  log("Block Two");
  log(post);

  const container = $("<a />");
  container.attr("href", url);
  container.attr("target", "_blank");
  container.addClass("share__half");

  const imageWrap = $('<div class="share__half__img" />');

  const img = $("<img />");
  img.attr("src", imgUrl);

  const containerBottom = $("<div />");
  containerBottom.addClass("share__half__text");
  containerBottom.addClass("module--blackish");

  const text = $("<p />");
  text.text(newCaption);

  const iconWrap = $('<span class="share__half__icon" />');

  let icon;
  if (url.indexOf("youtube.com") > -1) {
    icon = $('<span class="share__icon__Youtube" />');
  } else if (url.indexOf("instagram.com") > -1) {
    icon = $('<span class="share__icon__Instagram" />');
  } else if (url.indexOf("twitter.com") > -1) {
    icon = $('<span class="share__icon__Twitter" />');
  }

  iconWrap.append(icon);
  container.append(imageWrap);
  container.append(containerBottom);
  containerBottom.append(text);
  containerBottom.append(iconWrap);
  imageWrap.append(img);

  $(".grid-two").append(container);
}

function buildBlockThree(results) {
  if (results.length === 0) return;
  const stepOne = results.filter(i => !i.used);
  const post = sample(stepOne);
  const url = post.indexUrl;
  const imgUrl = post.metaData.I.split("|")[0];

  const caption = post.metaData.c;
  const newCaption = trimCaption(caption, 200);

  post.used = true;

  log("Block Three");
  log(post);

  const container = $("<a />");
  container.addClass("share__img");
  container.attr("href", url);
  container.attr("target", "_blank");

  const img = $("<img />");
  img.attr("src", imgUrl);

  const hover = $('<span class="share__hover" />');
  const hoverP = $("<p />");
  hoverP.text(newCaption);
  hover.append(hoverP);

  const gradient = $('<div class="share__img__gradient" />');
  const iconWrap = $('<span class="share__half__icon" />');

  let icon;
  if (url.indexOf("youtube.com") > -1) {
    icon = $('<span class="share__icon__Youtube" />');
  } else if (url.indexOf("instagram.com") > -1) {
    icon = $('<span class="share__icon__Instagram" />');
  } else if (url.indexOf("twitter.com") > -1) {
    icon = $('<span class="share__icon__Twitter" />');
  }

  container.append(img);
  container.append(gradient);
  container.append(iconWrap);
  container.append(hover);
  iconWrap.append(icon);

  $(".grid-three").append(container);
}

function getFeed(feed) {
  return $.getJSON(feed).then(result => result.response.resultPacket.results);
}

function getAndCombineFeeds(feeds) {
  return $.when(...feeds.map(getFeed)).then((...results) => {
    return results.reduce((acc, item) => acc.concat(item), []);
  });
}

function getFeeds(prefix, elem) {
  const urls = [];
  let found = true;
  let idx = 1;
  while (found) {
    const url = $(elem).attr(`${prefix}-${idx}`);
    if (url) {
      urls.push(url);
      idx += 1;
    } else {
      found = false;
    }
  }
  return urls;
}

$(() => {
  if ($("#college-feeds").length > 0) {
    const feedElem = $("#college-feeds");

    $.when(
      getAndCombineFeeds(getFeeds("data-twitter-feed", feedElem)),
      getAndCombineFeeds(getFeeds("data-instagram-feed", feedElem)),
      getAndCombineFeeds(getFeeds("data-youtube-feed", feedElem))
    )
      .fail(err => {
        log("error loading feed JSON");
        log(err);
      })
      .done((twitterResults, instagramResults, youtubeResults) => {
        buildBlockOne(
          []
            .concat(twitterResults, instagramResults)
            .filter(i => i)
            .filter(i => i.metaData.I)
        );

        buildBlockTwo(
          []
            .concat(twitterResults, youtubeResults, instagramResults)
            .filter(i => i)
            .filter(i => i.metaData.I)
        );
        buildBlockThree(
          []
            .concat(twitterResults, youtubeResults, instagramResults)
            .filter(i => i)
            .filter(i => i.metaData.I)
        );
      });
  }
});
