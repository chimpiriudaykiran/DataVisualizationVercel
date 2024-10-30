var settings = {
  visible: 0,
  persist: 0,
  knobsToggle: true,
  theme: {
    styles: `z-index:999`,
     flow: 'compact',
     background: "rgb(0, 123, 255)",
  },

  knobs: [
    {
      cssVar: ['bs-body-bg', null, document.documentElement], // [alias for the CSS variable, units, applies on element]
      label: 'Background',
      type: 'color',
      onChange: (e) => {
        var iframe = document.getElementsByClassName("knobsIframe");
        var iframeContent = iframe[0].contentWindow;
        iframeContent.document.body.style.background = e.target.value;
      },
      updateBackground(val){
        var iframe = document.getElementsByClassName("knobsIframe");
        var iframeContent = iframe[0].contentWindow;
        iframeContent.document.body.style.background = val;
        iframeContent.document.body
      },
      updateMargin(val){
        var iframe = document.getElementsByClassName("knobsIframe");
        var iframeContent = iframe[0].contentWindow;
        iframeContent.document.body.style.margin = val;
      }
    },
    {
      cssVar: ['bs-body-color', null, document.documentElement], // [alias for the CSS variable, units, applies on element]
      label: 'Font color',
      type: 'color',
      value: '#000000',
    },
    {
      cssVar: ['plotly-template', null, document.documentElement],
      label: 'Graph Template',
      type: 'select',
      options: ['ggplot2', 'seaborn', 'simple_white', 'plotly',
        'plotly_white', 'plotly_dark', 'presentation', 'xgridoff',
        'ygridoff', 'gridon', 'none'],
        placeholder:'Tetsssss',
      value: 'seaborn',
      defaultValue: 'seaborn',
    },
    {
      cssVar: ['bs-body-font-size', 'px', document.documentElement],
      label: 'Font size',
      type: 'range',
      value: 16,
      min: 10,
      max: 50,
      step: 1
    },
    {
      cssVar: ['bs-body-font-weight', null, document.documentElement],
      label: 'Font weight',
      type: 'range',
      value: 400,
      min: 100,
      max: 1000,
      step: 1
    },
    {
      cssVar: ['bs-body-line-height',  'px', document.documentElement],
      label: 'Line height',
      type: 'range',
      value: '18',
      min: 10,
      max: 50,
      step: 1
    }
  ]
}

var myKnobs = new Knobs(settings)

console.log(myKnobs);

// Add more knobs after initialization 
myKnobs.knobs = [...myKnobs.knobs, ...[
  "Knobs Self Parameters",
    {
      label: 'Compact View',
      type: 'checkbox',
      value: 'none',
      checked: myKnobs.settings.theme.flow == 'compact',
      onChange: (e, knobData = {}) => {
        if(myKnobs){ 
          myKnobs.DOM.scope[`${(knobData.checked ? "set" : "remove")}Attribute`]("data-flow", "compact")
          setTimeout(()=> {
              myKnobs.calculateGroupsHeights()
          }, 300)
        }
      }
    },
    {
      cssVar: ['knobs-gap', 'px'],
      label: 'Space between knobs',
      type: 'range',
      value: 3,
      min: 0,
      max: 10,
      step: 1,
      onChange: (e, knobData = {}) => {
        if(myKnobs){ 
          myKnobs.DOM.scope.style.setProperty(`--knobs-gap`, `${knobData.value}px`)
          myKnobs.calculateGroupsHeights()
        }
      }
    },
    {
      cssVar: ['background', null, myKnobs.DOM.scope],
      label: 'Knobs Background',
      type: 'color',
      value: "rgba(0,24,89,.9)"
    },
    {
      cssVar: ['primaryColor', null, myKnobs.DOM.scope],
      label: 'Slider Color',
      type: 'color',
      value: '#0366D6'
    },
    {
      cssVar: ['textColor', null, myKnobs.DOM.scope],
      label: 'Text Color',
      type: 'color',
      value: '#FFFFFF',
    },

]]

myKnobs.render()