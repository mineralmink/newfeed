*** Settings ***
Library		SeleniumLibrary

*** Variables ***
${BROWSER}    chrome
${URL}    localhost:3000

*** Keywords ***
Open Discover
    Open Browser    ${URL}    ${BROWSER}
		Maximize Browser Window
    Execute Javascript   window.scrollTo(0,document.body.scrollHeight)

Close
  Close Browser
*** Test Cases ***
Search
    Open Discover
    //Close
