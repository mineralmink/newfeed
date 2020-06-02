*** Settings ***
Library		SeleniumLibrary

*** Variables ***
${BROWSER}    chrome
${URL}    localhost:3000

*** Keywords ***
Open Discover
    Open Browser    ${URL}    ${BROWSER}
		Maximize Browser Window
    Wait Until Element Is Visible  id=user_profile
Open User Profile Page Via Profile Picture
    Wait Until Element Is Visible  id=user_profile
    Click Image    id=user_profile
Open User Profile Page Via Username
    Wait Until Element Is Visible  id=user_name
    Click Element  id=user_name
Go Back To Discover Page
    Wait Until Element Is Visible  id=back_to_main
    Wait Until Element Is Visible  id=user_profile
    Click Image    id=back_to_main

Close
  Close Browser

*** Test Cases ***
Test Case A: Discover page can be opened
    Open Discover
    Close

Test Case B1: Go To UserProfile With Profile Picture
    Open Discover
    Open User Profile Page Via Profile Picture
    Close

Test Case B2: Go To UserProfile With Profile Picture And Back
    Open Discover
    Open User Profile Page Via Profile Picture
    Go Back To Discover Page
    Close

Test Case C1: Go To UserProfile With Username
    Open Discover
    Open User Profile Page Via Username
    Close

Test Case C2: Go To UserProfile With Username And Back
    Open Discover
    Open User Profile Page Via Username
    Go Back To Discover Page
    Close
