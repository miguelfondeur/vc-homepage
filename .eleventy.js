const esbuild = require("esbuild");

// CSS bundling function
async function bundleCss() {
  const result = await esbuild.build({
      entryPoints: ["src/css/main.css"],
      bundle: true,
      minify: true,
      outfile: "public/css/main.min.css",
      loader: {
          ".css": "css"
      }
  });
  return result;
}

module.exports = function(eleventyConfig) {

  // CSS
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addWatchTarget("src/css");

  eleventyConfig.addPassthroughCopy("src/images");

  // JS
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addWatchTarget("src/js");

  // Fonts
  eleventyConfig.addPassthroughCopy("src/fonts");
  
  // Copy minified CSS from public to _site
  eleventyConfig.addPassthroughCopy({ "public/css/main.min.css": "css/main.min.css" });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      llayouts: "_includes", 
      data: "_data"
    }
  };
}; 