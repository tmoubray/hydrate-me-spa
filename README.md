# HYDRATEME Template

The following lines apply to this site but have been adapted from another theme named UND. Note this in the commands as you read.

## Build Process

Here is a brief step by step process of setting up the project for compiling. 

1. Install [NPM](https://www.npmjs.com/) 
2. After installing NPM make sure that it is in your path so you can use it in the command line. It usually works out of the bag in MAC/Linux, but sometimes the path needs to be added [manually in Windows](http://stackoverflow.com/questions/27864040/fixing-npm-path-in-windows-8/32159233).
3. Extract the project files and cd to the directory in your command line.
4. Run `npm install` to install all the dependencies for the project. This can take several minutes.
5. Once you have the dependencies installed, to build the project and "watch" any changes in sass, js, or html partials you will run `gulp` in the command line.

A browser window will open of the project and you will be able to see it edited live. Whenever you make a change to the html, sass, or js, the browser automatically refreshes.

With the project running, the command line will chirp at you if there are any issues with how your code is compiled. It's very helpful!

If you want to add new svg icons you just drop them into src/svgstore. They will be automatically compiled and turned into a spritesheet. You can see how icons are used in some of the html partials. They can also be used directly in the sass.

### Maintaining the inline html file 

* ./index-inline.html - Where the root inline file lives

* ./dist/index-inline.html - Where you need to manually drag file to upload 

* ./src/js/inline-script.js - This is the source inline javascript file that should be updated

* ./dist/js/inline-script.js - This is the output file that will be manually created with the browserify command below

Localist requires the svgs be inlined in the html so a custom html page is in the directory root for this purpose. You will need to manually drag that to the /dist folder in order to publish it to the AWS bucket.

I created a custom inline-script.js file for this inline html file to avoid any problems with unused javascript loading on the page. The annoying thing is that the browserify build process doesn't need to wrap the javascript code in a module export so you will need to manually do that to inline the javascript in the page.

To do so, open up your console and cd to the UND directory and type the following:

```
browserify src/js/inline-script.js --s module > dist/js/inline-script.js
```

This manually does what the automated build does, but the output code is standalone "--s" in a module wrapper.

The transpiled code is now in dist/js/inline-script.js. Paste that into a script tag at the bottom of index-inline.html. Done!

## Using the New Theme on WordPress

To start using the new blog theme, activate the UND Blog theme and necessary plugins outlined below. Once everything is activated, the following settings and steps will ensure your theme is working as intended. 

### Theme

UND Blog Theme

### Settings

**General**

* Site Title - will serve as blog title and title on Site Billboard
* Tagline - will serve as a subtitle on Site Billboard

**Reading**

Be sure to set a static page as the homepage.

**Advanced Editor Tools (previously TinyMCE Advanced)**

This plugin allows custom design elements incorporated in the theme to be available in wysiwygs across the site. For this to work ensure that you are using the Classic Editor (TInyMCE). From the **Unused Buttons** section drag and frop _Formats_ to the **Toolbars for the Classic Editor**. Now you'll have access to two button styles and a serif stylized font.

### Custom Page Templates

* Latest - a listing of latest posts
* Archives - a listing of archives by month and category
* No Sidebar - page or post with no sidebar and content aligned left
* Full Width - page or post with no sidebar and content aligned center

### Plugins

* Advanced Custom Fields
* Advanced Custom Fields PRO
* Advanced Editor Tools (previously TinyMCE Advanced)
* Classic Editor
* MailPoet 2
* Yoast SEO

### Widgets

* Text
* MailPoet Subscription Form
* Social Buttons
* Categories
* Meta
* Archives
* Tag List 

### Menus

There are two custom menus created for the footer:

* Footer Menu 1
* Footer Menu 2

If there are no menus associated with these display locations then no submenus will show in the Main Footer section. See below for more footer options with Advanced Custom Fields.

### Site Options with Advanced Custom Fields

There are a number of new Site Options to explore.

#### Theme Options

**Theme Color**

Select a color for the site:

* Default is UND green
* Brown
* Blue
* Maroon

**Display Author**

Check to allow the display of Author section on single posts across the site. You will also be able to conrtol this on a per post basis.

#### Header

##### Site Billboard

The Billboard will be featured site wide. 

**Site Title and Tagline**
The Site Title and Tagline must be set in `Settings > General` for them to show in in the Site Billboard. 

**Use Tagline in Site Billboard**
Check to display the site Tagline below the Site Title in the site header. The default setting is to not display the Tagline.

**Site Billboard Desktop Image**
Image size 1920x400. Displayed on medium to large viewports.

**Site Billboard Mobile Image**
Image size 768x160. Displayed on smaller viewports.

**Site Billboard Style Options**
Three Options Available:

1. Text only - shows Title and Tagline(if Use Tagline option is checked) against the site color background.
2. Custom Image Only - displays only an image if one is uploaded.
3. Custom Image with text - displays Title and Tagline (if Use Tagline option is checked) over an image if one is uploaded.

#### Featured Posts Slider

Options to enable the Featured Posts Slider on the home page and allows for automatically showing most recent posts or selected posts. If a post does not have a Featured Image, it will not be included in the Featured Posts Slider.

**Enable Featured Posts Slider**
Check to endable the Featured Posts Slider on the home page.

**Turn on Automatic Featured Posts**
When checked, the four most recent posts with a Featured Image will be displayed.

**Featured Posts**
A select option that allows you to search for a specific post, search by taxonomy, and shows whether there is a featured image associated with a post or not.

#### Footer

The footer is comprised of two major parts, the main footer and the legal footer.

The **Main Footer** has 4 columns:

1. Contact - configured in Site Options with a Title, Info and Link
2. Footer Menu 1 - customizable in the Menus section
3. Footer Menu 2 - customizable in the Menus section
4. Social - customizable in the Social Buttons section of Site Options

The **Legal Footer** has 2 parts:

1. The legal footer - customizable in the Menus section
2. Copyright

#### Social Buttons

These social buttons will appear in both the footer and the sidebar. The Social Title or Link Text correspond with the proper SVG so please be mindful of spelling here!

#### Global Sidebar Options

We've provided a full customizable global sidebar field for above and below all other widgets selected.

### MailPoet 2 Form for Newsletter Subscriptions

To create a newsletter subscription form go to Settings under the MailPoet 2 menu. In Settings under the Forms tab you can create a new form. Here you can edit the display of the form, add subscribers to a specific list, and customize a return message after submit. Once you've created and saved this form there is a link to go to the widgets menu to add this form to the sidebar.

There are custom styles that are affecting the MailPoet Sidebar Newsletter Subscription Form widget, therefore only an input and submit button are suggested for this form to ensure the desired look and feel.

### Yoast SEO Settings for Breadcrumbs

From the WordPress Dashboard go to SEO > Search Appearance >Breadcrumbs

Under Breadcrumbs Settings:

- Enable breadcrumbs
- Set Anchor text for the Homepage to :  `<span class="breadcrumb__link__icon svgstore svgstore--home"></span>`
- Set prefixes and remaining settings as desired

When you've finished be sure to save your changes!