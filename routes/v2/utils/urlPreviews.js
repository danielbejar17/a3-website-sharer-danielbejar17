import fetch from 'node-fetch';

import parser from 'node-html-parser';

async function getURLPreview(url){
  // TODO: Copy from your code for making url previews in A2 to make this
  // a function that takes a url and returns an html string with a preview of that html

  let previewHtml = ``;

  try {
      let contents = await fetch(url);
      let htmlContents = await contents.text();

      let html = parser.parse(htmlContents);
      let metaTags = html.querySelectorAll('meta');

      let ogUrl;
      let ogTitle;
      let ogImage;
      let ogDescription;

      let ogSiteName;

      // If all info is there
      metaTags.forEach(tag => {
        let property = tag.getAttribute('property');
        let content = tag.getAttribute('content');

        if (property === 'og:url') {
          ogUrl = content;
        }
        if (property === 'og:title') {
          ogTitle = content
        }
        if (property === 'og:image') {
          ogImage = content;
        }
        if (property === 'og:description') {
          ogDescription = content;
        }
        if (property === 'og:site_name') {
          ogSiteName = content;
        }
      });

      // If open graph url is missing
      if (!ogUrl) {
        ogUrl = url;
      }

      // If title is missing
      if (!ogTitle) {
        let titleTag = html.querySelector('title');
        if (titleTag) {
          ogTitle = titleTag.text;
        } else {
          ogTitle = url;
        }
      }

      // html formatting
      previewHtml += `<div style="max-width: 300px; border: 1px solid black; border-radius: 8px; padding: 8px; text-align: center; background-color: #e6f0ff;">`;

      previewHtml += `<a href="${ogUrl}">`;

      if (ogSiteName) {
        previewHtml += `<p style="font-size: 12px; color: gray;">${ogSiteName}</p>`;
      }

      previewHtml += `<p><strong>${ogTitle}</strong></p>`;

      if (ogImage) {
        previewHtml += `<img src="${ogImage}" style="max-height: 200px; max-width: 270px;">`;
      }

      previewHtml += `</a>`;

      if (ogDescription) {
        previewHtml += `<p>${ogDescription}</p>`
      }

      previewHtml += `</div>`;

      return previewHtml;

    } catch (err) {
      previewHtml = `<p>${err.message}</p>`;
      return previewHtml;
    }
}

export default getURLPreview;