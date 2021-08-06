
var theme = function () {
  this.FONT_SMALL = 12;
  this.FONT_MEDIUM = 14;
  this.FONT_LARGE = 16;
  this.VERY_DARK = "#1e122b";
  this.DARK = "#301E48";
  this.LIGHT_PINK = "#7286F6";
  this.GOLD = '#F1BF42';
  this.TEXT_COLOR = '#FFFFFF';
  this.mainFont = 'Comfortaa';
  this.mainFontLight = 'ComfortaaLight';
  this.mainFontBold = 'ComfortaaBold';
  this.loadingIcon = {
    color: this.GOLD,
    textColor: this.TEXT_COLOR
  },
  this.icons = {
    color: this.GOLD,
    textColor: this.TEXT_COLOR,
    tabIcon: {
      activeTintColor: this.LIGHT_PINK,
      inactiveTintColor: this.GOLD,
      textColor: this.TEXT_COLOR,
    }
  },
  this.generalLayout = {
    backgroundColor: this.DARK,
    textColor: this.TEXT_COLOR,
    font: this.mainFont,
    fontLight: this.mainFontLight,
    secondaryColor: this.LIGHT_PINK,
    highlight: this.GOLD,
    fontBold: this.mainFontBold
  }
};
var AppTheme = new theme();
export default AppTheme;