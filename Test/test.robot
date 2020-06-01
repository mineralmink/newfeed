*** Settings ***
Library		SeleniumLibrary

*** Variables ***
${BROWSER}    chrome
${URL}    localhost:3000

*** Keywords ***
Open Discover
    Open Browser    ${URL}    ${BROWSER}
		Maximize Browser Window
Open User Profile Page Via Profile Picture
    Click Image    id=user_profile
Open User Profile Page Via Username
    Click Element  id=user_name
Go Back To Discover Page
    Click Image    id=back_to_main

Close
  Close Browser

*** Test Cases ***
Test Case: Discover page can be opened
    Open Discover
    Close
    
Test Case: Go To UserProfile With Profile Picture And Back
    Open Discover
    Open User Profile Page Via Profile Picture
    Go Back To Discover Page
    Close

Test Case: Go To UserProfile With Username And Back
    Open Discover
    Open User Profile Page Via Username
    Go Back To Discover Page
    Close
