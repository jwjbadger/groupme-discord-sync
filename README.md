# groupme-discord-sync

Syncs messages / announcements between discord and groupme

## Install

These instruction were written to help with an exact step-by-step install, but for those with more experience, the gist is as follows:
1. Create a Discord bot and invite it to your server with permissions integer 17603460459584 ([Discord Setup](#discord-setup))
2. Create an AWS account and IAM user with access to 'AWSLambda_FullAccess,' ‘IAMFullAccess,' and ‘AmazonAPIGatewayAdministrator’ & create an access key ([AWS Setup](#aws-setup)
3. Configure the AWS CLI to use the access key ([Installation Step 5](installation))
4. Clone the repo and run `npm install` and `npm run deploy` from the root folder ([Installation Steps 6-9](#installation))
5. Add the Discord bot token to 'config.json' ([Config Step 3](#config))
6. Create the GroupMe bot for the private server and provide it's information when necessary; use the callback URL provided from `npm run deploy` for this bot ([Installation Steps 10-15](#installation))
7. Copy the Bot ID you just created to "ALL_GROUPME_BOT_ID" in 'config.json'; Create a new bot for the public server (for announcements) and copy it's ID over ([Config Step 4-7](#config))

### Discord Setup

1. Go to https://discord.com/developers/applications and sign in; you will likely have to create some form of multi-factor authentication
2. Enter a name for your bot (under ‘application-name’); the bot will only act as a method of configuring the syncing between GroupMe and Discord -> choose a name that reflects this
    1. Click the checkbox to agree to the terms and conditions
    2. Click ‘Create’
3. Configure the bot as preferred:
    1. Add a profile picture if wanted
    2. Add a description if wanted
4. Click ‘Bot’ on the left side of the screen
5. Go down to the ‘Privileged Gateway Intents’ section and enable ‘MESSAGE CONTENT INTENT’
6. Click ‘OAuth2’ on the left side of the screen
7. Click ‘URL Generator’ under it
8. Under ’Scopes’ select ‘bot’ 
9. Copy the link that it creates for you; it should look something like this: “https://discord.com/api/oauth2/authorize?client_id=2136635404190073188&permissions=0&scope=bot”
10. In the link above (USE YOUR OWN LINK, NOT MINE), change the permissions number (‘permissions=0’) within the link to 17603460459584 (‘permissions=17603460459584’); For example, my link would look like: “https://discord.com/api/oauth2/authorize?client_id=2136635404190073188&permissions=17603460459584&scope=bot” (AGAIN -> USE YOUR OWN LINK)
11. Now go to the link you have created
12. Select the desired server from the dropdown and click ‘continue’
13. Ensure all checkboxes are selected then click ‘authorize’
14. Ensure you are human
15. You may close this tab; leave the discord developer console open or remember how to get back to it

### AWS Setup

1. Click the link https://portal.aws.amazon.com/billing/signup#/start/email 
2. Enter your email and a valid username
3. Copy the verification code from your email and enter it
4. Create a valid password
5. Select ‘personal’ as your account purpose then enter the following information
6. Enter payment information
    1. IMPORTANT NOTE: YOU SHOULD NOT BE CHARGED AT ALL (or you will be charged <$3 even if people send a million messages) BUT IT IS YOUR RESPONSIBILITY TO CHECK HOW MUCH YOU OWE AND IF SOMETHING GOES WRONG; IT IS NOT MY FAULT IF YOU END UP HAVING TO PAY (you shouldn’t, but don’t quote me on that; research it yourself)
7. Continue with the signup, verifying your identity, until you get to the ‘support plan’ section
8. Ensure the free support plan is selected (unless you wanna pay money for some reason lol)
9. Click ‘Go to the AWS Management Console’
10. Login with the username and password you just created
11. Rearrange the widgets as you please
12. [I personally recommend] moving the cost widget to the very top and making it larger
    1. Click ’Turn on Cost Explorer’ (on the cost widget; you have to scroll down a bit to see it by default)
    2. Explore around; click ‘AWS’ in the top left to return to the console whenever you are done
    3. The cost widget will likely take a few hours to update
13. Click ‘Services’ -> ‘Security, Identity, and Compliance’ (from the dropdown) -> IAM (on the right side; you will have to scroll a bit) OR search ‘IAM’ and click the IAM Service
14. On the left-side menu, click ‘Users’
15. Click ‘Create User’
16. Enter a username; ensure the checkbox is NOT selected; click next
17. Ensure ‘Add user to group’ is selected; click next
18. Click your newly created user; go to the ‘Groups’ tab; click ‘Add user to groups’; click ‘Create group’
19. Add some name to identify your group (something related to programmatic access)
20. Search for the permissions policy ‘AWSLambda_FullAccess’ and select it; select ‘IAMFullAccess’ as well; select ‘AmazonAPIGatewayAdministrator’
21. Finish the group, select it, and click ‘Add user to group(s)’
22. Now, go to the ’Security credentials’ tab (you should be under the user page you created)
23. Scroll to the ‘Access keys’ section and click ‘Create access key’
24. Select ‘Third-party service’ and click the checkbox ‘I understand the above recommendation and want to proceed to create an access key.’
25. Click next; add a description; click ‘Create access key’
26. COPY THE ACCESS KEY SOMEWHERE AND THE SECRET ACCESS KEY; YOU CAN PASTE THEM IN THIS DOC; THEY ARE TWO SEPARATE THINGS AND YOU WILL NOT BE ABLE TO SEE THE SECRET ACCESS KEY ANYMORE AFTER THIS STEP
27. Click ‘Done’
28. Click ‘Services’ at the top again, click ‘Compute’ on the left, and click ‘Lambda’ on the right side (or search for ‘Lambda’)
29. Leave this page open (or remember how to get back to the lambda dashboard)

### Project Setup

#### Installation

1. Install Git from this page https://git-scm.com/downloads 
2. Install Node.js and NPM from this page https://nodejs.org/en/download/
3. Go to the following page https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html and follow the instructions to install the AWS CLI for your computer
4. Run the following command in a terminal (AFTER INSTALLING NPM/NODE) `npm install claudia -G`)
    1. Run `claudia —version` to check installation
5. Run the command `aws configure` (AFTER INSTALLING THE AWS CLI) and enter the two keys you saved earlier; hit enter twice after to use the default information for the rest of the config
6. Open a terminal; navigate to the folder you would like to store the project in using `ls` to list all folders in your current directory and `cd` to change directory (your current directory should be listed in the terminal, but depending on your computer, it may be listed differently)
7. Once you are in the right directory, run the command `git clone https://github.com/jwjbadger/groupme-discord-sync.git`
8. Now run `cd groupme-discord-sync` (unless you changed the name of the git repo)
9. Run `npm install` and then `npm run deploy`
10. Wait until you see the text ‘Your GroupMe bot Request URL (POST only) is,’ then copy the given link (it should look like: ‘https://7g4dg0edya.execute-api.us-east-1.amazonaws.com/latest/groupme’ (USE YOUR ONE LINK NOT THIS ONE)
11. Go to https://dev.groupme.com/bots/new and sign OR go to https://dev.groupme.com, sign in, and click Bots -> Create Bot
12. Choose the group with your INDIVIDUAL USERS; THIS IS NOT THE BOT FOR THE ANNOUNCEMENTS
13. Keep the checkbox unselected and paste the link you copied into the ‘Callback URL’
14. Now, add a URL to a profile picture if you want and click ‘Submit’
15. Copy the Bot ID found on the website and paste it into the terminal as prompted (prompted like: ‘GroupMe Bot Id:’)

#### Config

1. Open up config.json in the root of your project folder in your favorite text editor (e.g. Notepad or TextEdit; if you are more familiar with code, use a more advanced editor)
2. You should see 6 different pairs of things where on the left side there is a word or sequence of words and on the right side there are empty quotes; you will be modifying the empty quotes so it holds the data you wish
3. Under “BOT_TOKEN” -> go back to the discord developers page you left open (or find your way back to it) and open the bots tab; click ‘Reset Token’ and follow the instructions to get your token; paste your token inside the quotes when you finish
4. Under “PREFIX” -> change this to the prefix for all commands; the default is ‘;’
5. Under “ANNOUNCEMENTS_GROUPME_BOT_ID” -> go back to https://dev.groupme.com/bots/new (or follow the instructions in step 11 from installation) and create a new bot as you did before except add it to the public GroupMe with everyone in it; THIS IS YOUR ANNOUNCEMENTS BOT; LEAVE THE ‘CALLBACK URL’ BLANK; copy the Bot ID and paste it into the quotes
6. Under “ALL_GROUPME_BOT_ID” -> copy the Bot ID of the bot which will send ALL messages to those who need it (this is the one for individual users)
7. Save the file and exit

#### Running

1. In the same terminal (or a new one in the project directory) -> run `node .`
2. You should see ‘Ready! Logged in as’ and then your bot’s username if all goes well

## Usage

- Run the help command by sending ‘;help’ anywhere in the discord (or use the prefix you set)
- Prepend ‘]’ (square bracket) to your message in order to hide it from the GroupMe
- Configure the bot using commands shown from ‘;help’
    - Note, the AWS bot will be automatically updated, but it takes time; the AWS bot may lag behind any changes you make by up to a minute
- Be sure to set the announcements channel and individual channels to be forwarded before beginning or nothing will appear to work
    - Use commands from ‘;help’

## Updating / Rebooting

- To update, go to the project directory in your terminal and run `git pull`, `npm update`, and `npm upgrade`
    - You should make a backup of ‘config.json’ because it will be overridden 
- To restart the bot, open the terminal it’s running in and input ‘Control + C’ (this should stop the command); then re-run `node .` (you shouldn’t have to do anything else) 
