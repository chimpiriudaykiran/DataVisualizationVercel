var selectedGraphType = 'bar';
var headerNames = [];
var finalData = [];
var selectedX;
var selectedY;
var selectedAmount;
var radioValues = [];

var outputDiv;
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';
recognition.maxAlternatives = 3;

let recognizing = false;

var speechVisualStarted = false;
var speechFileSelected = false;
var speechGraphSelected = false;
var speechXSelected;
var speechYSelected;
var speechAmountSelected = false;

recognition.onerror = function(event) {
    recognizing = false;
};
recognition.onnomatch = function(event) {
    recognizing = false;
};
recognition.onend = function(event) {
    recognizing = false;
};

recognition.onresult = function(event) {
    let interimTranscript = '';
    let finalTranscript = '';
    console.log(event);
    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
        } else {
            interimTranscript += event.results[i][0].transcript;
        }
    }
    //if (!finalTranscript) { finalTranscript = interimTranscript; }
    if (finalTranscript) {
        console.log(finalTranscript);
        var pathComponents = window.location.pathname.split('/');
        var source = pathComponents[pathComponents.length - 1].split('.')[0];
        if (source === '') {
            source = 'index';
        }

        pathComponents.pop();
        var newPath = pathComponents.join('/');

        outputDiv = document.getElementById('recognizedText');
        if (outputDiv) {
            outputDiv.innerText = finalTranscript;
        }

        switch (source) {
            case 'index':
                if (finalTranscript.toLowerCase().includes("visualisation") ||
                    finalTranscript.toLowerCase().includes("visualization") ||
                    finalTranscript.toLowerCase().includes("dashboard")) {
                    speakText('Navigating to visualization page');
                    outputDiv.innerText = 'Navigating to visualization page';
                    window.top.location = '.' + newPath + '/home';
                }
            case 'home':
                if (finalTranscript.toLowerCase().includes("start")) {
                    speechVisualStarted = true;
                    speechFileSelected = false;
                    speechGraphSelected = false;
                    speechXSelected = undefined;
                    speechYSelected = undefined;
                    speechAmountSelected = false;
                    document.getElementById('upload-data').click();
                    speakText('Please select the file');
                } else if (finalTranscript.toLowerCase().includes("no") ||
                    finalTranscript.toLowerCase().includes("reset") ||
                    finalTranscript.toLowerCase().includes("restart")) {
                    speechVisualStarted = false;
                    speechFileSelected = false;
                    speechGraphSelected = false;
                    speechXSelected = undefined;
                    speechYSelected = undefined;
                    speechAmountSelected = false;
                    speakText('Please say start when you are ready');
                } else if (finalTranscript.toLowerCase().includes("home") ||
                    finalTranscript.toLowerCase().includes("index")) {
                    speakText('Navigating to home page');
                    outputDiv.innerText = 'Navigating to home page';
                    window.top.location = '.' + newPath + '/';
                } else if (finalTranscript.toLowerCase().includes("help")) {
                    document.getElementById('helpButton').click();
                }
                else {
                    var selectedNumber;
                    if (isNaN(parseInt(finalTranscript.toLowerCase()))) {
                        selectedNumber = parseInt(wordToNumber(finalTranscript.toLowerCase()));
                    } else {
                        selectedNumber = parseInt(finalTranscript.toLowerCase());
                    }

                    if (speechVisualStarted == true &&
                        speechFileSelected == true &&
                        speechGraphSelected == false &&
                        speechXSelected === undefined &&
                        speechYSelected === undefined &&
                        speechAmountSelected == false) {

                        if (selectedNumber) {
                            if (selectedNumber >= 1 && selectedNumber <= radioValues.length) {
                                toggleGraphs(selectedNumber - 1);
                                speechGraphSelected = true;

                                speakText('Please select the X value')
                                headerNames.forEach((type, index) => {
                                    speakTextQueue(`${index + 1}: ${type}`);
                                });
                            } else {
                                speakText('Please select a visualization type.')
                                radioValues.forEach((type, index) => {
                                    speakTextQueue(`${index + 1}: ${type}`);
                                });
                            }
                        } else if (finalTranscript.toLowerCase().includes("repeat") ||
                            finalTranscript.toLowerCase().includes("continue")) {
                            speakText('Please select a visualization type.')
                            radioValues.forEach((type, index) => {
                                speakTextQueue(`${index + 1}: ${type}`);
                            });
                        }


                    } else if (speechVisualStarted == true &&
                        speechFileSelected == true &&
                        speechGraphSelected == true &&
                        speechXSelected === undefined &&
                        speechYSelected === undefined &&
                        speechAmountSelected == false) {

                        if (selectedNumber) {
                            if (selectedNumber >= 1 && selectedNumber <= headerNames.length) {
                                toggleXAxis(selectedNumber);
                                speechXSelected = selectedNumber;
                                speakText('Please select the Y value')
                            } else {
                                speakText('Please select the X value')
                                headerNames.forEach((type, index) => {
                                    speakTextQueue(`${index + 1}: ${type}`);
                                });
                            }
                        } else if (finalTranscript.toLowerCase().includes("repeat") ||
                            finalTranscript.toLowerCase().includes("continue")) {
                            speakText('Please select the X value')
                            headerNames.forEach((type, index) => {
                                speakTextQueue(`${index + 1}: ${type}`);
                            });
                        }
                    } else if (speechVisualStarted == true &&
                        speechFileSelected == true &&
                        speechGraphSelected == true &&
                        speechXSelected !== undefined &&
                        speechYSelected === undefined &&
                        speechAmountSelected == false) {

                        if (selectedNumber) {
                            if (selectedNumber >= 1 && selectedNumber <= headerNames.length) {
                                if (speechXSelected === selectedNumber) {
                                    speakText('X and Y values should not be same');
                                } else {
                                    toggleYAxis(selectedNumber);
                                    speechYSelected = selectedNumber;
                                    speakText('Please select the amount of data you want to select');
                                }
                            } else {
                                speakText('Please select the Y value')
                                headerNames.forEach((type, index) => {
                                    speakTextQueue(`${index + 1}: ${type}`);
                                });
                            }
                        } else if (finalTranscript.toLowerCase().includes("repeat") ||
                            finalTranscript.toLowerCase().includes("continue")) {
                            speakText('Please select the Y value')
                            headerNames.forEach((type, index) => {
                            speakTextQueue(`${index + 1}: ${type}`);
                            });
                        }


                    } else if (speechVisualStarted == true &&
                        speechFileSelected == true &&
                        speechGraphSelected == true &&
                        speechXSelected !== undefined &&
                        speechYSelected !== undefined &&
                        speechAmountSelected == false) {

                        if (selectedNumber) {
                            if (selectedNumber >= 1 && selectedNumber <= 100) {
                                updateRangeValue(0, selectedNumber);
                                speechAmountSelected = true;
                                speakText('You have selected');
                                speakText('Graph type as ' + selectedGraphType);
                                speakText('X-axis as ' + headerNames[selectedX]);
                                speakText('Y-axis as ' + headerNames[selectedY]);
                                speakText('Data percentage:' + selectedAmount);
                                speakText('Please say yes to cotinue with visualisation or no to restart');
                            } else {
                                speakText('Please select the between 1 and 100');
                            }
                        }

                    } else if (speechVisualStarted == true &&
                        speechFileSelected == true &&
                        speechGraphSelected == true &&
                        speechXSelected !== undefined &&
                        speechYSelected !== undefined &&
                        speechAmountSelected == true) {

                        if (finalTranscript.toLowerCase().includes("yes") ||
                            finalTranscript.toLowerCase().includes("yeah") ||
                            finalTranscript.toLowerCase().includes("continue") ||
                            finalTranscript.toLowerCase().includes("s") ||
                            finalTranscript.toLowerCase().includes("submit") ||
                            finalTranscript.toLowerCase().includes("visualize")) {
                            speakText('Visualization is in progress');
                            callGraph();
                        } else if (finalTranscript.toLowerCase().includes("no") ||
                            finalTranscript.toLowerCase().includes("reset") ||
                            finalTranscript.toLowerCase().includes("restart")) {
                            speechVisualStarted = false;
                            speechFileSelected = false;
                            speechGraphSelected = false;
                            speechXSelected = undefined;
                            speechYSelected = undefined;
                            speechAmountSelected = false;
                            speakText('Please say start when you are ready');
                        }
                    }

                }

        }
    }
};

function handleSpeechFileSelect() {
    var file = document.getElementById('upload-data').files[0];
    if (!file) {
        speakText("You didn't select any file. You can reselect file saying Start again");
        speechVisualStarted = false;
    } else {
        speakText("You have selected file" + file.name + ". Now Please select a visualization type.");
        speechFileSelected = true;
        if ( radioValues !== undefined) {
            var radioButtons = document.getElementsByClassName('tab');

            for (var i = 0; i < radioButtons.length; i++) {
                radioValues.push(radioButtons[i].textContent);
            }
        }
        radioValues.forEach((type, index) => {
            speakTextQueue(`${index + 1}: ${type}`);
        });
    }
}

function wordToNumber(word) {
    const Small = {
        'zero': 0,
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
        'five': 5,
        'six': 6,
        'seven': 7,
        'eight': 8,
        'nine': 9,
        'ten': 10,
        'eleven': 11,
        'twelve': 12,
        'thirteen': 13,
        'fourteen': 14,
        'fifteen': 15,
        'sixteen': 16,
        'seventeen': 17,
        'eighteen': 18,
        'nineteen': 19,
        'twenty': 20,
        'thirty': 30,
        'forty': 40,
        'fifty': 50,
        'sixty': 60,
        'seventy': 70,
        'eighty': 80,
        'ninety': 90
    };

    const Magnitude = {
        'thousand': 1000,
        'million': 1000000,
        'billion': 1000000000,
        'trillion': 1000000000000,
        'quadrillion': 1000000000000000,
        'quintillion': 1000000000000000000,
        'sextillion': 1000000000000000000000,
        'septillion': 1000000000000000000000000,
        'octillion': 1000000000000000000000000000,
        'nonillion': 1000000000000000000000000000000,
        'decillion': 1000000000000000000000000000000000
    };

    let a, n, g;
    a = word.toString().split(/[\s-]+/);
    n = 0;
    g = 0;

    function feach(w) {
        const x = Small[w];
        if (x != null) {
            g += x;
        } else if (w === "hundred") {
            g *= 100;
        } else {
            const y = Magnitude[w];
            if (y != null) {
                n += g * y;
                g = 0;
            }
        }
    }

    a.forEach(feach);
    return n + g;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Strict";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

var sKeyPressed = false;
var sKeyStartTime;
var sRecordingDuration;
var sRecording = false;
const targetDuration = 2;
var sRecognition = false;

function startRecording() {
    if (!sRecording) {
        sKeyStartTime = Date.now();
        sRecording = true;
    } else {
        let duration = (Date.now() - sKeyStartTime) / 1000;
        if (duration >= targetDuration && !sRecognition) {
            speakText('Speech Recognition is on. Hold Space to speak');
            sRecognition = true;
        }
    }
}

function stopRecording() {
    if (sRecording) {
        sRecordingDuration = (Date.now() - sKeyStartTime) / 1000;
        sRecording = false;
    }
}

function keyDown(event) {
    console.log(event.key + 'Pressed');
    if (event.key === 's') {
        sKeyPressed = true;
        startRecording();
    } else if (event.key === ' ') {
        if (!recognizing && getCookie('speech') == 2) {
            recognizing = true;
            recognition.abort();
            recognition.start();
        }
    }
}


function keyUp(event) {
    console.log(event.key + 'Released');
    if (event.key === 's') {
        stopRecording();
        sKeyPressed = false;
        sRecording = false;

        if (sRecordingDuration >= targetDuration) {
            setCookie('speech', 2, 1);
        } else {
            let speech = getCookie('speech');
            if (speech == 1) {
                setCookie('speech', 0, 1);
                stopSpeaking();
                speakText('Speech mode is off');
            } else {
                setCookie('speech', 1, 1);
                speakText('Speech mode is on');
            }
        }
    } else if (event.key === 'u') {
        document.getElementById('upload-data').click();
    } else if (event.key === 'r') {
        toggleGraphs();
    } else if (event.key === 'x') {
        toggleXAxis();
    } else if (event.key === 'y') {
        toggleYAxis();
    } else if (event.key === 'Enter') {
        callGraph();
    } else if (event.key === 'ArrowRight') {
        updateRangeValue(5);
    } else if (event.key === 'ArrowLeft') {
        updateRangeValue(-5);
    } else if (event.key === 't') {
        if (getCookie('speech') == 1 || getCookie('speech') == 2) {
            speakText(document.getElementById('text-output').innerHTML);
        }
    } else if (event.key === 'c') {
        swapValues();
    } else if (event.key === 'd') {
        document.getElementById("darkmode-toggle").click();
    } else if ((event.key === 'm') || event.key === 'Escape') {
        stopSpeaking();
        myKnobs.toggle(0);
    } else if (event.key === 'h') {
        document.getElementById('helpButton').click();
    } else if (event.key === ' ') {
        if (recognizing === true) {
            recognizing = false;
            recognition.stop();
        }
    }

}

function initializeIndex() {
    if (getCookie('sppech') == 1 || getCookie('speech') == 2) {
        speakText('Welcome to Data Visualization Tool for Visually Impaired');
    }
    document.addEventListener("keyup", keyUp);
    document.addEventListener("keydown", keyDown);
}

function initializeHome() {
    if (getCookie('speech') == 2) {
        speakText('You can say Start to start the visualization. For help say help or click H');
    }

    document.addEventListener("keyup", keyUp);
    document.addEventListener("keydown", keyDown);
    document.getElementById('upload-data').addEventListener('change', function() {
        handleFileSelect();
        if (getCookie('speech') == 2) {
            handleSpeechFileSelect();
        }
    });

    document.getElementById('amountrange').addEventListener('change', function() {
        if (selectedAmount !== this.value) {
            selectedAmount = this.value;
            if (getCookie('speech') == 1 || getCookie('speech') == 2) {
                speakText(selectedAmount + '%')
            }; // callGraph();
        }
    });

    window.onclick = function(event) {
        myKnobs.toggle(0);
    }

    var helpModal = document.getElementById('helpModal');
    var darkmode = document.getElementById('darkmode-toggle');
    var observer = new MutationObserver(function(mutationsList, observer) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                if (helpModal.style.display === 'none') {
                    stopSpeaking();
                } else {
                    var bgVal = getComputedStyle(document.documentElement).getPropertyValue('--bs-body-bg');
                    if (isBlackShade(bgVal)) {
                        darkmode.checked = true;
                    } else {
                        darkmode.checked = false;
                    }
                }
            }
        }
    });

    observer.observe(helpModal, { attributes: true });
    observer.observe(document.documentElement, { attributes: true });


    selectedAmount = document.getElementById('amountrange').value;
    myKnobs.knobs[0].updateMargin('0px');

    // Listen for changes in the radio buttons
    var radioButtons = document.getElementsByName('graph-type');
    radioButtons.forEach(function(radioButton) {
        radioButton.addEventListener('change', function() {
            selectedGraphType = this.value;
            if (getCookie('speech') == 1 || getCookie('speech') == 2) {
                speakText(selectedGraphType);
            }
            if (selectedGraphType == 'pie' || selectedGraphType == 'histogram') {
                document.getElementById('y-axis-dropdown').disabled = true;
            } else {
                document.getElementById('y-axis-dropdown').disabled = false;
            }
            // callGraph();
        });
    });

    document.getElementById('x-axis-dropdown').addEventListener('change', function() {
        selectedX = this.value;

        if (getCookie('speech') == 1 || getCookie('speech') == 2) {
            speakText(headerNames[selectedX]);
        }
        var yAxis = document.getElementById('y-axis-dropdown');
        if (selectedY === this.value || (selectedY === undefined && yAxis.value === this.value)) {
            for (var i = 0; i < yAxis.options.length; i++) {
                var option = yAxis.options[i];

                if (option.value === 'none')
                    option.selected = true;
                break;
            }

        }

        yAxis.childNodes.forEach(function(option) {
            if (option.value === selectedX) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });

        // callGraph();
    });

    document.getElementById('y-axis-dropdown').addEventListener('change', function() {
        selectedY = this.value;

        if (getCookie('speech') == 1 || getCookie('speech') == 2) {
            speakText(headerNames[selectedY]);
        }

        var xAxis = document.getElementById('x-axis-dropdown');
        if (selectedX === this.value || (selectedX === undefined && xAxis.value === this.value)) {
            for (var i = 0; i < xAxis.options.length; i++) {
                var option = xAxis.options[i];

                if (option.value === 'none')
                    option.selected = true;
                break;
            }

        }

        xAxis.childNodes.forEach(function(option) {
            if (option.value === selectedY) {
                option.disabled = true;
            } else {
                option.disabled = false;
            }
        });

        // callGraph();
    });

}

function callGraph() {
    console.log(selectedX, selectedY);
    if (selectedX !== undefined) {
        if (selectedX !== selectedY && selectedY !== undefined) {
            drawChart(finalData);
        } else if (selectedGraphType == 'pie' || selectedGraphType == 'histogram') {
            drawChart(finalData);
        }
    }
}

function handleFileSelect() {
    var file = document.getElementById('upload-data').files[0];
    var reader = new FileReader();

    if (file) {
        if (file.name.endsWith('.csv')) {
            reader.onload = function(event) {
                Papa.parse(event.target.result, {
                    complete: function(results) {

                        var filteredData = results.data.filter(row => row.some(cell => cell.trim() !== ''));
                        var parsedData = filteredData.map(row => row.map(cell => isNaN(cell) ? String(cell) : parseFloat(cell)));
                        parsedData.sort((a, b) => a[0] - b[0]);
                        headerNames = filteredData[0];
                        finalData = parsedData;

                        updateXDropdown(headerNames);
                        updateYDropdown(headerNames);
                    }
                });
            };
            reader.readAsText(file);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            reader.onload = function(event) {
                var data = new Uint8Array(event.target.result);
                var workbook = XLSX.read(data, {
                    type: 'array'
                });
                var sheetName = workbook.SheetNames[0];
                var sheet = workbook.Sheets[sheetName];
                var excelData = XLSX.utils.sheet_to_json(sheet, {
                    header: 1
                });

                var filteredData = excelData.filter(row => row.some(cell => String(cell).trim() !== ''));
                var parsedData = filteredData.map(row => row.map(cell => isNaN(cell) ? String(cell) : parseFloat(cell)));
                parsedData.sort((a, b) => a[0] - b[0]);
                headerNames = filteredData[0];
                finalData = parsedData;

                updateXDropdown(headerNames);
                updateYDropdown(headerNames);
            };
            reader.readAsArrayBuffer(file);
        } else {
            console.error('Unsupported file format');
        }
    }
}

function updateXDropdown(headerNames) {
    var xAxisDropdown = document.getElementById('x-axis-dropdown');
    xAxisDropdown.innerHTML = '';

    var optionX = document.createElement('option');
    optionX.selected = true;
    optionX.hidden = true;
    optionX.value = 'none';
    optionX.textContent = 'Select X-axis';
    xAxisDropdown.appendChild(optionX);

    // Populate dropdowns with header names
    headerNames.forEach(function(header, index) {
        var optionX = document.createElement('option');
        optionX.value = index;
        optionX.textContent = header;
        xAxisDropdown.appendChild(optionX);
    });

}

function updateYDropdown(headerNames) {
    var yAxisDropdown = document.getElementById('y-axis-dropdown');

    yAxisDropdown.innerHTML = '';

    var optionY = document.createElement('option');
    optionY.selected = true;
    optionY.hidden = true;
    optionY.value = 'none';
    optionY.textContent = 'Select Y-axis';
    yAxisDropdown.appendChild(optionY);

    // Populate dropdowns with header names
    headerNames.forEach(function(header, index) {
        var optionY = document.createElement('option');
        optionY.value = index;
        optionY.textContent = header;
        yAxisDropdown.appendChild(optionY);
    });

}

function drawChart(data) {

    const loadingSpinner = document.getElementById('loading-spinner');
    loadingSpinner.style.display = 'block';
    stopSpeaking();

    var datatmp = data.slice(0);
    datatmp.shift();

    var jsonData = [];

    datatmp.forEach(function(row) {
        var obj = {};
        headerNames.forEach(function(header, index) {
            obj[header] = row[index];
        });
        jsonData.push(obj);
    });

    var xVal, yVal;

    if (selectedX === 'none' || selectedX === undefined) {
        xVal = headerNames[document.getElementById('x-axis-dropdown').value];
    } else {
        xVal = headerNames[selectedX];
    }

    if (selectedY === 'none' || selectedX == undefined) {
        yVal = headerNames[document.getElementById('y-axis-dropdown').value];
    } else {
        yVal = headerNames[selectedY];
    }

    if ((xVal === 'none' || xVal === undefined) || ((yVal === 'none' || yVal === undefined) && (selectedGraphType !== 'pie' && selectedGraphType !== 'histogram'))) {
        loadingSpinner.style.display = 'none';
        return;
    }

    const jsonObject = {
        "data": jsonData,
        "graphType": selectedGraphType,
        "x": xVal,
        "y": yVal,
        "filter": parseInt(selectedAmount),
        "template": getComputedStyle(document.documentElement).getPropertyValue('--plotly-template')
    };

    var jsonResult = JSON.stringify(jsonObject, null, 2);
    console.log(jsonResult);

    const iframe = document.getElementById('html-iframe');
    iframe.setAttribute('style', 'width:100%; height:100%; border:0;');
    document.getElementById('chart_div').style.display = 'block';
    const url = '/chart';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: jsonResult
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
            loadingSpinner.style.display = 'none';

            iframe.srcdoc = 'Network response was not ok';

            iframe.onload = function() {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                iframeDocument.body.style.background = getComputedStyle(document.documentElement).getPropertyValue('--bs-body-bg');
            };
            if (getCookie('speech') == 1 || getCookie('speech') == 2) {
                speakText('Network response was not ok')
            };
        }

        var text = response.json();
        return text;
    }).then(data => {
        loadingSpinner.style.display = 'none';

        iframe.srcdoc = data.graph;

        iframe.onload = function() {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            iframeDocument.body.style.background = getComputedStyle(document.documentElement).getPropertyValue('--bs-body-bg');
        };

        document.getElementById('text-output').innerHTML = data.text;
        if (getCookie('speech') == 1 || getCookie('speech') == 2) {
            speakText(data.text);
        }
    }).catch(error => {
        console.error('Error:', error);
        loadingSpinner.style.display = 'none';

        iframe.srcdoc = error;

        iframe.onload = function() {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            iframeDocument.body.style.background = getComputedStyle(document.documentElement).getPropertyValue('--bs-body-bg');
        };
    });

}

function swapValues() {
    var xAxis = document.getElementById('x-axis-dropdown');

    var xselectedIndex = xAxis.selectedIndex;
    var xselectedValue = xAxis.options[xselectedIndex].value;

    var yAxis = document.getElementById('y-axis-dropdown');

    var yselectedIndex = yAxis.selectedIndex;
    var yselectedValue = yAxis.options[yselectedIndex].value;

    selectedX = yselectedValue;
    selectedY = xselectedValue;

    xAxis.childNodes.forEach(function(option) {
        if (option.value === yselectedValue) {
            option.selected = true;
        } else {
            option.selected = false;
        }
        if (option.value === selectedY) {
            option.disabled = true;
        } else {
            option.disabled = false;
        }
    });

    yAxis.childNodes.forEach(function(option) {
        if (option.value === xselectedValue) {
            option.selected = true;
        } else {
            option.selected = false;
        }
        if (option.value === selectedX) {
            option.disabled = true;
        } else {
            option.disabled = false;
        }
    });

    // callGraph();
}

function updateRangeValue(updateValue, finalvalue = undefined) {
    var rangeInput = document.getElementById('amountrange');
    var newValue;
    if (finalvalue !== undefined) {
        newValue = finalvalue;
    } else {
        newValue = parseInt(rangeInput.value) + parseInt(updateValue);
    }
    if(newValue>100){newValue=100;}
    rangeInput.value = newValue;

    rangeInput.parentNode.style.setProperty('--value', newValue);
    rangeInput.parentNode.style.setProperty('--text-value', '"' + newValue + '"');
    rangeInput.dispatchEvent(new Event('change', {
        bubbles: true
    }));
}

let synth = window.speechSynthesis;
let utterance = new SpeechSynthesisUtterance();

let textQueue = [];
let isSpeaking = false;

function  speakText(text){
    utterance.text = text;
        synth.speak(utterance);
}

// Function to speak text
function speakTextQueue(text) {
    textQueue.push(text);

    if (!isSpeaking) {
        speakNext();
    }
}

function speakNext() {
    if (textQueue.length > 0) {
        isSpeaking = true;
        const textToSpeak = textQueue.shift();
        utterance.text = textToSpeak;
        synth.speak(utterance);
    } else {
        isSpeaking = false;
    }
}

utterance.addEventListener("end", (event) => { speakNext(); });
utterance.addEventListener("onend", (event) => { speakNext(); });
utterance.addEventListener("pause", (event) => { console.log(event) });
utterance.addEventListener("error", (event) => {
    console.log(event);
    isSpeaking = false;
});
utterance.addEventListener("mark", (event) => { console.log(event) });
utterance.addEventListener("start", (event) => { console.log(event) });


function stopSpeaking() {
    synth.cancel();
}

function toggleGraphs(graph = undefined) {
    var radioButtons = document.getElementsByName('graph-type');
    var checkedIndex = 0;
    if (graph !== undefined) {
        nextIndex = graph;
    } else {
        radioButtons.forEach((radioButton, index) => {
            if (radioButton.checked) {
                checkedIndex = index;
                radioButton.checked = false;
                return;
            }
        });

        nextIndex = (checkedIndex + 1) % (radioButtons.length);
    }
    radioButtons[nextIndex].checked = true;
    radioButtons[nextIndex].dispatchEvent(new Event('change', {
        bubbles: true
    }));
}

function toggleXAxis(x = undefined) {
    var xAxis = document.getElementById('x-axis-dropdown');
    var selectedIndex = 0;
    let nextIndex;

    if (x !== undefined) {
        nextIndex = x;
    } else {
        xAxis.childNodes.forEach(function(option, index) {
            if (option.selected) {
                selectedIndex = index;
                return;
            }
        });

        nextIndex = selectedIndex + 1;
        nextIndex %= (xAxis.options.length);
        if (nextIndex === 0) { nextIndex += 1; }
        if (nextIndex - 1 === parseInt(selectedY)) { nextIndex += 1; }
        nextIndex %= (xAxis.options.length);
        if (nextIndex === 0) { nextIndex += 1; }
    }
    xAxis.options[nextIndex].selected = true;
    xAxis.options[nextIndex].dispatchEvent(new Event('change', {
        bubbles: true
    }));
}

function toggleYAxis(y = undefined) {
    let yAxis = document.getElementById('y-axis-dropdown');
    var selectedIndex = 0;
    let nextIndex;
    if (y !== undefined) {
        nextIndex = y;
    } else {
        yAxis.childNodes.forEach(function(option, index) {
            if (option.selected) {
                selectedIndex = index;
                return;
            }
        });

        nextIndex = selectedIndex + 1;
        nextIndex %= (yAxis.options.length);
        if (nextIndex === 0) { nextIndex += 1; }
        if (nextIndex - 1 === parseInt(selectedX)) { nextIndex += 1; }
        nextIndex %= (yAxis.options.length);
        if (nextIndex === 0) { nextIndex += 1; }
    }

    yAxis.options[nextIndex].selected = true;
    yAxis.options[nextIndex].dispatchEvent(new Event('change', {
        bubbles: true
    }));
}

// function toggleAmount() {
//     var radioButtons = document.getElementsByName('graph-type');
//     var checkedIndex = 0;

//     radioButtons.forEach((radioButton, index) => {
//         if (radioButton.checked) {
//             checkedIndex = index;
//             radioButton.checked = false;
//         }
//     });

//     nextIndex = (checkedIndex + 1) % (radioButtons.length);
//     radioButtons[nextIndex].checked = true;
//     speakText(radioButtons[nextIndex].value);
// }

function readHelp() {
    if (getCookie('speech') == 1 || getCookie('speech') == 2) {
        let helpText = document.getElementById('modal-body').textContent;;
        speakText(helpText);
    }
}

function toggleTheme(obj) {
    if (obj.checked === false) {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        document.documentElement.style.setProperty('--bs-body-bg', '#ffffff');
        document.documentElement.style.setProperty('--bs-body-color', '#212529');

        document.documentElement.style.setProperty('--plotly-template', 'seaborn');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.documentElement.style.setProperty('--bs-body-bg', '#212529');
        document.documentElement.style.setProperty('--bs-body-color', '#dee2e6');

        document.documentElement.style.setProperty('--plotly-template', 'plotly_dark');
    }

    var bgval = getComputedStyle(document.documentElement).getPropertyValue('--bs-body-bg');

    var event = new Event('change');
    myKnobs.knobs[0].value = bgval;
    myKnobs.knobs[0].updateBackground(bgval);

    const iframe = document.getElementById('html-iframe');
    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    iframeDocument.body.style.background = getComputedStyle(document.documentElement).getPropertyValue('--bs-body-bg');

}

function isBlackShade(color) {
    let hex = color.replace("#", "");
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    const threshold = 50;

    return r <= threshold && g <= threshold && b <= threshold;
}