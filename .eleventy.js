const fs = require("fs");
const esbuild = require("esbuild");

// Bundles your CSS
async function bundleCss() {
    await esbuild.build({
        entryPoints: ["src/css/main.css"],
        bundle: true,
        minify: true,
        outfile: "public/css/main.min.css",
        loader: {
            ".css": "css",
            ".png": "file",
            ".jpg": "file",
            ".svg": "file",
            ".gif": "file",
            ".webp": "file"
        },
        assetNames: "assets/img/[name]",  // Cache-busting hash filenames
    });
}

// Bundles your JS code
async function bundleJs() {
    await esbuild.build({
        entryPoints: ["src/js/index.js"],      
        bundle: true,
        minify: true,
        outfile: "public/js/bundle.js",       // Bundled output
        format: "esm",                        // ES Module format
        platform: "browser",                  // Targeting browser
        sourcemap: true,                      // Source maps for debugging
        loader: {
            ".js": "js"
        }
    });
}

// Image processing shortcode for HTML
async function imageShortcode(src, alt, className = "", widths = [300, 600, 1200], formats = ["webp", "jpeg"]) {
}

module.exports = function(eleventyConfig) {
    // Add absoluteUrl filter - using relative URLs for local development
    eleventyConfig.addFilter("absoluteUrl", function(url) {
        if (url.startsWith("http")) {
            return url;
        }
        return url.startsWith("/") ? url : `/${url}`;
    });

    // Passthroughs
    eleventyConfig.addPassthroughCopy({ "src/netlify": "netlify" });
    eleventyConfig.addPassthroughCopy({ "src/manifest.json": "" });
    eleventyConfig.addPassthroughCopy({ "src/pdfs": "pdfs" });
    eleventyConfig.addPassthroughCopy({ "src/models": "models" });   // GLTF model passthrough
    eleventyConfig.addPassthroughCopy({ "src/js": "js" });
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });   // Copy assets directory
    eleventyConfig.addPassthroughCopy({ "src/img": "img" });         // Copy img directory
    eleventyConfig.addWatchTarget("src/css");
    eleventyConfig.addWatchTarget("src/assets");  // Watch assets directory
    eleventyConfig.addWatchTarget("src/img");     // Watch img directory
    eleventyConfig.addWatchTarget("src/articles"); // Watch articles directory

    // Collections
    eleventyConfig.addCollection("articles", function(collection) {
        return collection.getFilteredByGlob("src/articles/**/*.html");
    });

    // Image shortcode for HTML
    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
    eleventyConfig.addLiquidShortcode("image", imageShortcode);

    // CSS & JS bundling on Eleventy build
    eleventyConfig.on("eleventy.before", async () => {
        await bundleCss();
        await bundleJs();
    });

    // Read file filter
    eleventyConfig.addFilter("readFile", function (filepath) {
        return fs.readFileSync(filepath, "utf8");
    });

    return {
        dir: {
            input: "src",
            data: "_data",
            output: "public",
            includes: "_includes",
            layouts: "_includes"
        }
    };
};