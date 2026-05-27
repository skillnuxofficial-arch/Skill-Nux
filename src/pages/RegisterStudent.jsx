import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import confetti from 'canvas-confetti';
import BackgroundVideo from '../components/BackgroundVideo';

const skillsList = {
  'Digital Marketing': ['SEO & SEM', 'Social Media Management', 'Content Writing', 'Email Marketing', 'YouTube & Blog', 'Paid Ads', 'WhatsApp Marketing', 'Influencer Outreach', 'Online Reputation'],
  'Design & Creative': ['Logo & Brand Design', 'UI/UX Design', 'Video Editing', 'Thumbnail Design', 'Poster & Flyer', 'Motion Graphics', 'Reels Editing', 'Product Photography', 'Packaging Design', 'Pitch Deck Design', 'Canva Design'],
  'Tech & Development': ['Web Development', 'No-Code Automation', 'Database Management', 'API Integration', 'Landing Pages', 'Shopify Setup', 'WordPress', 'App UI Design', 'Chatbot Setup'],
  'Business & Finance': ['Market Research', 'Data Entry & Analysis', 'Excel & Google Sheets', 'Presentations PPT', 'Business Writing', 'Customer Support', 'Amazon Flipkart Listing', 'Hindi Content Writing', 'Regional Language Content'],
  'AI & Automation': ['ChatGPT Prompting', 'AI Image Generation', 'AI Video Creation', 'Notion Zapier Automation']
};

const allQuestions = {
  'SEO & SEM': [{q:'What does SEO stand for?',opts:['Search Engine Optimization','Social Engine Output','Search Email Outreach','Site Engine Optimization'],ans:0},{q:'Which tag is most important for SEO?',opts:['footer','title','div','span'],ans:1},{q:'What is a backlink?',opts:['A broken link','A link from another website to yours','An internal link','A paid ad link'],ans:1},{q:'What is keyword density?',opts:['Keywords in meta tags','How often a keyword appears relative to total words','Number of images','Website speed'],ans:1},{q:'What is Google Search Console used for?',opts:['Running paid ads','Monitoring website performance in Google search','Email campaigns','Building websites'],ans:1}],
  'Social Media Management': [{q:'What does reach mean on social media?',opts:['Number of comments','Unique users who saw your post','Total likes','Number of shares'],ans:1},{q:'What is a content calendar?',opts:['A holiday calendar','A planned schedule of posts','A follower list','A payment schedule'],ans:1},{q:'Which metric shows interactions on your post?',opts:['Impressions','Reach','Engagement Rate','Followers'],ans:2},{q:'What is the ideal Instagram bio length?',opts:['500 chars','150 chars','300 chars','50 chars'],ans:1},{q:'What is a social media audit?',opts:['Deleting posts','Reviewing your social media performance and strategy','Adding followers','Creating ads'],ans:1}],
  'Content Writing': [{q:'What is a CTA in content writing?',opts:['Create Text Always','Call To Action','Content Title Area','Copy Text Automation'],ans:1},{q:'What is the ideal blog length for SEO?',opts:['200-300 words','500-600 words','1500-2500 words','5000+ words'],ans:2},{q:'What is evergreen content?',opts:['Content about nature','Content that stays relevant over time','Seasonal content','Spring content'],ans:1},{q:'What is a hook in writing?',opts:['A fishing term','An opening that grabs readers attention','A conclusion','A subheading'],ans:1},{q:'What is the inverted pyramid style?',opts:['Writing from bottom to top','Most important info first then details','Writing in triangles','A design technique'],ans:1}],
  'Email Marketing': [{q:'What is a good email open rate?',opts:['1-5%','15-25%','50-60%','80-90%'],ans:1},{q:'What is A/B testing in email?',opts:['Sending emails twice','Testing two versions to see which performs better','A billing method','An email format'],ans:1},{q:'What is email bounce rate?',opts:['Emails opened twice','Emails that could not be delivered','Emails with images','Forwarded emails'],ans:1},{q:'What is email segmentation?',opts:['Dividing email into sections','Dividing email list into groups','Deleting old emails','Scheduling emails'],ans:1},{q:'What is the best subject line strategy?',opts:['Long detailed lines','Short personal curiosity-driven lines','All caps','No subject'],ans:1}],
  'YouTube & Blog': [{q:'What is CTR on YouTube?',opts:['Channel Total Revenue','Click Through Rate','Comment To Replies','Content Transfer Rate'],ans:1},{q:'What is the ideal YouTube video length for monetization?',opts:['Under 1 min','1-3 mins','8-15 mins','1 hour+'],ans:2},{q:'What does watch time mean on YouTube?',opts:['When you watch videos','Total minutes viewers spent watching','Time editing','Upload time'],ans:1},{q:'What is a blog permalink?',opts:['A broken link','The permanent URL of a blog post','A blog category','A blog image'],ans:1},{q:'What is a meta description?',opts:['A blog title','A short summary shown in search results','A category','An image caption'],ans:1}],
  'Paid Ads': [{q:'What does CPC mean?',opts:['Content Per Click','Cost Per Click','Clicks Per Campaign','Channel Per Cost'],ans:1},{q:'What is retargeting?',opts:['Changing your audience','Showing ads to people who already visited your site','Running ads twice','New customers only'],ans:1},{q:'What is ROAS?',opts:['Return On Ad Spend','Rate Of Ad Success','Revenue Of All Sales','Result Of Ad Survey'],ans:0},{q:'What is a lookalike audience?',opts:['People who look similar to you','New audience resembling your existing customers','A video audience','A local audience'],ans:1},{q:'What is Facebook Pixel used for?',opts:['Improving image quality','Tracking website visitors and conversions from ads','Creating ad designs','Scheduling posts'],ans:1}],
  'WhatsApp Marketing': [{q:'What is WhatsApp Business API used for?',opts:['Personal chatting','Large scale automated messaging for businesses','Video calling','File sharing only'],ans:1},{q:'What is a broadcast list?',opts:['A group chat','Sending message to multiple contacts at once','A video call','A story'],ans:1},{q:'What is a WhatsApp chatbot used for?',opts:['Making calls','Automating replies to customer messages','Sending images only','Creating groups'],ans:1},{q:'What does opt-in mean in WhatsApp marketing?',opts:['Opting out','Customer giving permission to receive messages','A payment option','A feature'],ans:1},{q:'What is click-to-WhatsApp ad?',opts:['A WhatsApp call ad','An ad that opens a WhatsApp chat when clicked','A text ad','A video ad'],ans:1}],
  'Influencer Outreach': [{q:'What is a micro-influencer?',opts:['An influencer under 18','An influencer with 1K-100K followers','An influencer with 10M+ followers','A celebrity'],ans:1},{q:'What is engagement rate?',opts:['Posts per day','(Likes + Comments) / Followers x 100','Total followers','Monthly earnings'],ans:1},{q:'What is a media kit?',opts:['A camera kit','A document showing influencer stats and collaboration details','A social media app','A video editing tool'],ans:1},{q:'What is UGC?',opts:['User Generated Content','Unlimited Growth Campaign','Unique Guest Content','User Group Chat'],ans:0},{q:'What is affiliate marketing?',opts:['Paid promotions','Earning commission for sales through a unique link','Free product reviews','Brand partnerships'],ans:1}],
  'Online Reputation': [{q:'What is ORM?',opts:['Online Revenue Management','Online Reputation Management','Organic Reach Maximization','Online Review Monitoring'],ans:1},{q:'What is the first step in handling a negative review?',opts:['Delete it','Ignore it','Respond professionally and offer a solution','Report the user'],ans:2},{q:'Which platform is most important for business reputation in India?',opts:['Pinterest','Google My Business','Snapchat','TikTok'],ans:1},{q:'What is a brand mention?',opts:['A paid advertisement','When someone talks about your brand online','A product description','A social media post'],ans:1},{q:'What is sentiment analysis?',opts:['Analyzing website speed','Analyzing whether mentions are positive negative or neutral','Counting mentions','Checking grammar'],ans:1}],
  'Logo & Brand Design': [{q:'What does brand identity include?',opts:['Only a logo','Logo colors typography and visual elements','Just colors','Only a tagline'],ans:1},{q:'What is a vector graphic?',opts:['A pixelated image','A scalable image that does not lose quality when resized','A photograph','A GIF'],ans:1},{q:'Which software is best for logo design?',opts:['MS Paint','Adobe Illustrator','Notepad','Excel'],ans:1},{q:'What is negative space in logo design?',opts:['Empty canvas','The space around and between subjects of an image','Dark colors','Unused colors'],ans:1},{q:'What is a mood board?',opts:['A feedback form','A visual collection of design inspirations and references','A color wheel','A logo template'],ans:1}],
  'UI/UX Design': [{q:'What does UX stand for?',opts:['User Experience','Unique Exchange','User Export','Unified Experience'],ans:0},{q:'What is a wireframe?',opts:['A website template','A basic visual layout showing structure','A final design','A code file'],ans:1},{q:'What is the purpose of a user persona?',opts:['A social media profile','A fictional representation of your target user','A design template','A testing tool'],ans:1},{q:'What is Figma used for?',opts:['Video editing','UI/UX design and prototyping','Email marketing','Coding websites'],ans:1},{q:'What is A/B testing in UX?',opts:['Testing two websites','Comparing two design versions to see which performs better','Testing on mobile','A coding test'],ans:1}],
  'Video Editing': [{q:'What is a jump cut?',opts:['A transition effect','Cutting between two shots of the same subject','A sound effect','A color grade'],ans:1},{q:'What is color grading?',opts:['Changing video speed','Adjusting colors and tones of a video for aesthetic effect','Adding subtitles','Trimming clips'],ans:1},{q:'What is the standard frame rate for smooth video?',opts:['10 FPS','24-30 FPS','5 FPS','100 FPS'],ans:1},{q:'What does B-roll mean?',opts:['Bad footage','Supplementary footage used to support the main video','Background music','A video format'],ans:1},{q:'Which software is best for professional video editing?',opts:['MS Word','Adobe Premiere Pro','Paint','Notepad'],ans:1}],
  'Thumbnail Design': [{q:'What makes a good YouTube thumbnail?',opts:['Small text dark colors','Bold text bright colors clear subject','No text at all','Plain background'],ans:1},{q:'What is the recommended YouTube thumbnail size?',opts:['500x500px','1280x720px','800x600px','1920x1080px'],ans:1},{q:'Why is contrast important in thumbnails?',opts:['To add more colors','To make elements stand out and grab attention','To reduce file size','To add effects'],ans:1},{q:'What emotion drives the most thumbnail clicks?',opts:['Boredom','Curiosity and excitement','Sadness','Neutral'],ans:1},{q:'What tool is great for quick thumbnail design?',opts:['Excel','Canva','MS Word','Notepad'],ans:1}],
  'Poster & Flyer': [{q:'What is the rule of thirds in design?',opts:['Using three colors only','Dividing design into 9 equal parts for balanced composition','Making three versions','Using three fonts'],ans:1},{q:'What is DPI in printing?',opts:['Design Per Image','Dots Per Inch print quality measure','Digital Print Interface','Design Print Index'],ans:1},{q:'What is hierarchy in poster design?',opts:['Sorting by date','Arranging elements by order of importance','A design style','A color scheme'],ans:1},{q:'What file format is best for printing?',opts:['JPG','PDF or TIFF','GIF','BMP'],ans:1},{q:'What is bleed in print design?',opts:['Red color in design','Extra area beyond the trim edge to prevent white borders','A gradient effect','A border style'],ans:1}],
  'Motion Graphics': [{q:'What software is most used for motion graphics?',opts:['MS Paint','Adobe After Effects','MS Word','Canva'],ans:1},{q:'What is keyframing in animation?',opts:['A keyboard shortcut','Setting start and end points for an animation','A video format','A sound effect'],ans:1},{q:'What is easing in animation?',opts:['Making animation slower','Controlling the acceleration and deceleration of motion','Making animation faster','A color effect'],ans:1},{q:'What does FPS mean in animation?',opts:['Files Per Second','Frames Per Second','Format Per Scene','Files Per Scene'],ans:1},{q:'What is a storyboard?',opts:['A social media board','A visual sequence plan showing animation scenes','A color board','A music sheet'],ans:1}],
  'Reels Editing': [{q:'What is the ideal length for an Instagram Reel?',opts:['5-7 seconds','7-15 seconds','60-90 seconds','5 minutes'],ans:1},{q:'What makes a Reel go viral?',opts:['Long duration','Trending audio fast cuts hook in first 3 seconds','No music','Complex effects'],ans:1},{q:'What is a hook in a Reel?',opts:['A fishing reference','The first 1-3 seconds that grab viewers attention','The last scene','A sound effect'],ans:1},{q:'What aspect ratio is best for Reels?',opts:['16:9','9:16 vertical','1:1','4:3'],ans:1},{q:'What is jump cutting used for in Reels?',opts:['Making videos longer','Removing unnecessary pauses to keep energy high','Adding transitions','Adding music'],ans:1}],
  'Product Photography': [{q:'What is the best background for product photography?',opts:['Colorful busy background','Clean white or neutral background','Dark cluttered background','Outdoor grass'],ans:1},{q:'What is the flat lay style?',opts:['A camera angle','Products photographed from directly above','A lighting technique','An editing style'],ans:1},{q:'What does good lighting do for product photos?',opts:['Makes them darker','Shows product details clearly and eliminates harsh shadows','Adds color filters','Makes products look smaller'],ans:1},{q:'What is retouching in product photography?',opts:['Taking photos again','Editing photos to remove imperfections and enhance appearance','A camera setting','A lighting style'],ans:1},{q:'What tool is used for removing backgrounds?',opts:['MS Paint','Adobe Photoshop or remove.bg','MS Word','Notepad'],ans:1}],
  'Packaging Design': [{q:'What is the most important element of packaging design?',opts:['Maximum colors','Clear brand identity and product information','Complex patterns','No text'],ans:1},{q:'What is die-cut packaging?',opts:['Standard rectangle packaging','Custom shaped packaging cut to a specific design','Packaging with no cuts','Digital packaging'],ans:1},{q:'What is unboxing experience?',opts:['Opening a box quickly','The emotional experience a customer feels when opening a package','A shipping method','A packaging material'],ans:1},{q:'Which software is used for packaging design?',opts:['MS Word','Adobe Illustrator or Photoshop','Excel','Notepad'],ans:1},{q:'What is a dieline in packaging?',opts:['A border design','A 2D template showing how packaging will be cut and folded','A color guide','A font style'],ans:1}],
  'Pitch Deck Design': [{q:'What is a pitch deck?',opts:['A presentation to impress investors','A product catalog','A social media post','A business card'],ans:0},{q:'How many slides is ideal for a pitch deck?',opts:['50+ slides','10-15 slides','2-3 slides','30 slides'],ans:1},{q:'What should be on the first slide?',opts:['Financial data','Company name tagline and logo','Team photos','Market research'],ans:1},{q:'What is the most important slide in a pitch deck?',opts:['Design slide','Problem and Solution slide','Thank you slide','Contact slide'],ans:1},{q:'What software is best for pitch decks?',opts:['MS Paint','PowerPoint Google Slides or Canva','MS Excel','Notepad'],ans:1}],
  'Canva Design': [{q:'What is Canva primarily used for?',opts:['Video editing','Graphic design for non-designers','Coding websites','Data analysis'],ans:1},{q:'What is a Canva template?',opts:['A blank page','A pre-designed layout that can be customized','A color palette','A font collection'],ans:1},{q:'What does brand kit in Canva allow you to do?',opts:['Save payment details','Store your brand colors fonts and logo for consistency','Download designs','Share with team'],ans:1},{q:'What is the magic resize feature?',opts:['Making images larger','Automatically resizing a design for different platforms','Changing colors','Adding animations'],ans:1},{q:'What is Canva Pro?',opts:['A free version','A paid version with advanced features','A mobile app','A design course'],ans:1}],
  'Web Development': [{q:'What does HTML stand for?',opts:['Hyper Text Markup Language','High Text Making Language','Hyper Tool Main Language','Home Text Markup Language'],ans:0},{q:'What is CSS used for?',opts:['Adding functionality','Styling and layout of web pages','Database management','Server configuration'],ans:1},{q:'What is responsive design?',opts:['Fast loading websites','Design that adapts to different screen sizes','Colorful design','Animated design'],ans:1},{q:'What is JavaScript used for?',opts:['Styling pages','Making web pages interactive and dynamic','Creating databases','Sending emails'],ans:1},{q:'What is a domain name?',opts:['A web hosting service','The address of a website like skillnux.in','A programming language','A website template'],ans:1}],
  'No-Code Automation': [{q:'What is Zapier used for?',opts:['Video editing','Connecting apps and automating workflows without code','Web design','Email marketing'],ans:1},{q:'What is a trigger in automation?',opts:['A button','An event that starts an automated workflow','A programming term','A website feature'],ans:1},{q:'What is Make formerly Integromat?',opts:['A design tool','A visual automation platform','A coding language','An email tool'],ans:1},{q:'What is a webhook?',opts:['A fishing tool','A way for apps to send real-time data to each other','A web browser','A design element'],ans:1},{q:'What does no-code mean?',opts:['Building without internet','Creating apps without writing code','Coding in different language','Working offline'],ans:1}],
  'Database Management': [{q:'What is SQL?',opts:['A programming language for web design','Structured Query Language for managing databases','Social Query Language','A design tool'],ans:1},{q:'What is a primary key in a database?',opts:['The most important table','A unique identifier for each record','The first column','A password'],ans:1},{q:'What does CRUD stand for?',opts:['Create Read Update Delete','Copy Retrieve Upload Download','Create Run Use Delete','Code Read Update Deploy'],ans:0},{q:'What is a foreign key?',opts:['A key from another country','A field that links to the primary key of another table','A secret key','A password field'],ans:1},{q:'What is indexing in databases?',opts:['Numbering tables','A technique to speed up database queries','Sorting data alphabetically','Deleting old data'],ans:1}],
  'API Integration': [{q:'What does API stand for?',opts:['Application Programming Interface','Automated Program Integration','Application Process Interface','Advanced Programming Index'],ans:0},{q:'What is a REST API?',opts:['A sleeping program','An architectural style for building web services','A database type','A design pattern'],ans:1},{q:'What does HTTP GET request do?',opts:['Sends data to server','Retrieves data from server','Deletes data','Updates data'],ans:1},{q:'What is JSON?',opts:['A programming language','A lightweight data format for APIs','A database','A server type'],ans:1},{q:'What is an API key used for?',opts:['Unlocking features','Authenticating and authorizing API requests','Encrypting data','Compressing files'],ans:1}],
  'Landing Pages': [{q:'What is the main purpose of a landing page?',opts:['Showing company history','Converting visitors into leads or customers','Displaying all products','Entertainment'],ans:1},{q:'What is above the fold?',opts:['The footer','The content visible without scrolling','The navigation menu','The contact form'],ans:1},{q:'What is a hero section?',opts:['A navigation bar','The prominent top section with headline and CTA','A testimonial section','A pricing table'],ans:1},{q:'What is social proof?',opts:['Links to social media','Testimonials reviews or client logos that build trust','A social media feed','A share button'],ans:1},{q:'What makes a good CTA button?',opts:['Small and grey','Clear action-oriented text with contrasting color','No text just an arrow','Very long text'],ans:1}],
  'Shopify Setup': [{q:'What is Shopify?',opts:['A social media platform','An e-commerce platform to build online stores','A design tool','A payment gateway'],ans:1},{q:'What is a Shopify theme?',opts:['A color scheme','A pre-built design template for your store','A product category','A shipping method'],ans:1},{q:'What is a Shopify app used for?',opts:['Installing games','Adding extra features and functionality to your store','Changing themes','Creating products'],ans:1},{q:'What is a collection in Shopify?',opts:['A set of orders','A group of products organized by category','A customer group','A payment method'],ans:1},{q:'What is Shopify Payments?',opts:['A separate app','Shopify built-in payment processor','A bank account','A shipping service'],ans:1}],
  'WordPress': [{q:'What is WordPress?',opts:['A social network','A CMS for building websites','A design tool','An email platform'],ans:1},{q:'What is a WordPress plugin?',opts:['A theme','Software that adds extra features to a WordPress site','A page template','A hosting service'],ans:1},{q:'What is Elementor in WordPress?',opts:['A hosting service','A drag-and-drop page builder plugin','A security plugin','A theme'],ans:1},{q:'What is a WordPress theme?',opts:['A plugin','A template that controls the look and layout of a WordPress site','A page','A blog post'],ans:1},{q:'What is WooCommerce?',opts:['A social media plugin','A WordPress plugin for creating online stores','A security plugin','A backup plugin'],ans:1}],
  'App UI Design': [{q:'What is the thumb zone on mobile?',opts:['A game feature','Area easily reachable by thumb for interaction','A touchscreen setting','A keyboard area'],ans:1},{q:'What does onboarding mean in app design?',opts:['App installation','The process of introducing new users to an app','App payment','App settings'],ans:1},{q:'What is a hamburger menu?',opts:['A food delivery feature','Three horizontal lines indicating a hidden navigation menu','A profile icon','A search bar'],ans:1},{q:'What is the minimum touch target size recommended?',opts:['10x10px','44x44px','100x100px','5x5px'],ans:1},{q:'What is a bottom navigation bar?',opts:['A footer','Navigation placed at bottom of mobile screen for easy thumb access','A tab bar on desktop','A back button'],ans:1}],
  'Chatbot Setup': [{q:'What is ManyChat used for?',opts:['Email marketing only','Building chatbots for Instagram WhatsApp and Facebook','Video editing','Web design'],ans:1},{q:'What is a chatbot flow?',opts:['A programming language','A sequence of automated messages and responses','A chat group','A payment system'],ans:1},{q:'What is an intent in chatbot design?',opts:['A chatbot goal','What the user wants to accomplish in a conversation','A message template','A bot feature'],ans:1},{q:'What is a fallback response?',opts:['A deleted message','The default reply when the bot does not understand the user','A payment message','A greeting message'],ans:1},{q:'What is live chat handover?',opts:['Transferring files','When a chatbot transfers conversation to a human agent','Sending messages','Starting a new chat'],ans:1}],
  'Market Research': [{q:'What is primary research?',opts:['Research from existing sources','Collecting new data directly through surveys or interviews','Reading books','Internet research'],ans:1},{q:'What is a focus group?',opts:['A team meeting','A small group providing feedback on a product or idea','A market survey','A competitor analysis'],ans:1},{q:'What is a SWOT analysis?',opts:['A financial report','Analyzing Strengths Weaknesses Opportunities and Threats','A market survey','A competitor study'],ans:1},{q:'What is TAM in market research?',opts:['Target Audience Marketing','Total Addressable Market','Team And Management','Technical Analysis Method'],ans:1},{q:'What is secondary research?',opts:['Research done second time','Research using existing published data and reports','A market survey','A competitor study'],ans:1}],
  'Data Entry & Analysis': [{q:'What is data validation in Excel?',opts:['Deleting data','Restricting what type of data can be entered in a cell','Sorting data','Formatting cells'],ans:1},{q:'What is a VLOOKUP used for?',opts:['Creating charts','Looking up a value in a table and returning related data','Formatting cells','Sorting data'],ans:1},{q:'What does data cleaning involve?',opts:['Deleting all data','Removing errors duplicates and inconsistencies from data','Creating charts','Adding more data'],ans:1},{q:'What is a pivot table?',opts:['A rotating table','A tool for summarizing and analyzing large datasets quickly','A data format','A chart type'],ans:1},{q:'What is data accuracy?',opts:['How fast data loads','How correct and error-free the data is','How colorful the data looks','How much data there is'],ans:1}],
  'Excel & Google Sheets': [{q:'What does SUMIF do in Excel?',opts:['Adds all numbers','Adds numbers that meet a specific condition','Subtracts numbers','Counts cells'],ans:1},{q:'What is conditional formatting?',opts:['Changing fonts','Automatically formatting cells based on their values','Adding borders','Merging cells'],ans:1},{q:'What is a named range in Excel?',opts:['A cell with a name','Assigning a name to a cell or range for easier reference in formulas','A sheet name','A column header'],ans:1},{q:'What does the COUNTIF function do?',opts:['Counts all cells','Counts cells that meet a specific condition','Adds cells','Deletes cells'],ans:1},{q:'What is data freezing in Excel?',opts:['Making data read-only','Keeping rows or columns visible while scrolling','Saving data','Locking the file'],ans:1}],
  'Presentations PPT': [{q:'What is the 10-20-30 rule in presentations?',opts:['10 slides 20 mins 30pt font minimum','10 colors 20 images 30 words','10 people 20 slides 30 mins','None of these'],ans:0},{q:'What makes a presentation slide effective?',opts:['Lots of text','One key idea per slide with visuals','Many bullet points','Fancy animations'],ans:1},{q:'What is the purpose of presenter notes?',opts:['Notes for the audience','Notes for the presenter to remember key points','Slide captions','Design notes'],ans:1},{q:'What is slide master in PowerPoint?',opts:['The first slide','A template that controls the design of all slides','The last slide','A special effect'],ans:1},{q:'What is the best font size for presentation body text?',opts:['8pt','24-28pt','60pt','12pt'],ans:1}],
  'Business Writing': [{q:'What is a business proposal?',opts:['A casual email','A formal document outlining a business plan or solution for a client','A social media post','A job application'],ans:1},{q:'What is an executive summary?',opts:['A summary written by executives','A brief overview of a longer business document','A financial report','A meeting agenda'],ans:1},{q:'What does professional tone in business writing mean?',opts:['Using slang','Clear respectful and formal language','Casual and funny','Short and incomplete'],ans:1},{q:'What is a memorandum?',opts:['A social media post','A short internal business communication','A legal document','A business card'],ans:1},{q:'What is the most important element of a business email?',opts:['Colorful fonts','Clear subject line and professional greeting','Long paragraphs','Many attachments'],ans:1}],
  'Customer Support': [{q:'What is the first step in handling an angry customer?',opts:['Argue back','Listen actively and acknowledge their frustration','Transfer the call','Hang up'],ans:1},{q:'What is first response time?',opts:['How long to solve a problem','Time taken to first reply to a customer query','Working hours','Call duration'],ans:1},{q:'What is a ticket in customer support?',opts:['A payment receipt','A logged record of a customer issue or request','A phone call','An email'],ans:1},{q:'What does empathy mean in customer support?',opts:['Being strict','Understanding and sharing the feelings of the customer','Providing discounts','Following a script'],ans:1},{q:'What is CSAT?',opts:['Customer Service And Training','Customer Satisfaction Score','Call Service Analysis Tool','Customer Support And Technology'],ans:1}],
  'Amazon Flipkart Listing': [{q:'What is most important for Amazon product ranking?',opts:['Price only','Sales velocity reviews and relevant keywords','Product color','Image size'],ans:1},{q:'What is a bullet point in Amazon listing?',opts:['A design element','Short key feature highlights on the product page','A review','A product image'],ans:1},{q:'What is A+ Content on Amazon?',opts:['A premium account','Enhanced product descriptions with images and comparison charts','A review system','A shipping option'],ans:1},{q:'What is keyword stuffing in listings?',opts:['Using many images','Overloading a listing with too many keywords unnaturally','A pricing strategy','A review tactic'],ans:1},{q:'What makes a good product title on Flipkart?',opts:['Very short title','Brand + Product Name + Key Feature + Size/Color','Only brand name','A catchy slogan'],ans:1}],
  'Hindi Content Writing': [{q:'What is the importance of Hindi content in India?',opts:['Not important','Reaches 500M+ Hindi speakers across India','Only for rural areas','Only for UP'],ans:1},{q:'What is transliteration?',opts:['Translating Hindi to English','Writing Hindi words in Roman script','A typing method','A design style'],ans:1},{q:'What is Hinglish?',opts:['A language course','A mix of Hindi and English used in modern Indian content','A dialect','A formal language'],ans:1},{q:'What type of content performs best in Hindi?',opts:['Technical jargon','Simple relatable emotional storytelling','Complex vocabulary','English words only'],ans:1},{q:'What tool helps with Hindi typing?',opts:['MS Word only','Google Input Tools or InScript keyboard','Notepad','Calculator'],ans:1}],
  'Regional Language Content': [{q:'Why is regional language content important for Indian businesses?',opts:['Not important','Reaches local audiences who prefer their native language','Only for small businesses','For international markets'],ans:1},{q:'Which Indian state has the highest Tamil-speaking population?',opts:['Karnataka','Tamil Nadu','Kerala','Andhra Pradesh'],ans:1},{q:'What is localization in content?',opts:['Translating only','Adapting content to suit local culture language and preferences','Changing the font','Adding images'],ans:1},{q:'What tool helps with regional language translation?',opts:['MS Paint','Google Translate or DeepL','MS Word spell check','Calculator'],ans:1},{q:'Which language has the most speakers after Hindi in India?',opts:['Tamil','Bengali','Telugu','Marathi'],ans:1}],
  'ChatGPT Prompting': [{q:'What is prompt engineering?',opts:['Building chatbots','Crafting effective instructions to get better outputs from AI models','Programming AI','Testing software'],ans:1},{q:'What is a system prompt in ChatGPT?',opts:['A coding command','Instructions given to set the AI role and behavior','A user message','A chat title'],ans:1},{q:'What does temperature control in AI models?',opts:['Processing speed','The randomness and creativity of AI responses','Memory usage','Response length'],ans:1},{q:'What is chain-of-thought prompting?',opts:['Asking multiple questions','Asking AI to reason step-by-step before giving an answer','A prompt format','A chat style'],ans:1},{q:'What is a zero-shot prompt?',opts:['A blank prompt','Asking AI to complete a task without providing examples','A short prompt','A complex prompt'],ans:1}],
  'AI Image Generation': [{q:'What is Midjourney?',opts:['A travel app','An AI tool that generates images from text descriptions','A photo editor','A design tool'],ans:1},{q:'What is a prompt in AI image generation?',opts:['A camera setting','Text description that tells the AI what image to create','An image filter','A design template'],ans:1},{q:'What does negative prompt do?',opts:['Creates dark images','Tells the AI what to exclude from the generated image','Reduces quality','Slows generation'],ans:1},{q:'What is Stable Diffusion?',opts:['A photography technique','An open-source AI image generation model','A design software','A color technique'],ans:1},{q:'What does aspect ratio mean in AI image generation?',opts:['Image quality','The width-to-height ratio of the generated image','Image file size','Color depth'],ans:1}],
  'AI Video Creation': [{q:'What is Runway ML used for?',opts:['Running marathons','AI-powered video editing and generation','Web design','Email marketing'],ans:1},{q:'What is text-to-video AI?',opts:['Converting subtitles','AI that generates video content from text descriptions','A teleprompter','A video translator'],ans:1},{q:'What is HeyGen used for?',opts:['Greeting cards','AI avatar video creation for presentations and marketing','Photo editing','Website building'],ans:1},{q:'What is CapCut AI used for?',opts:['Cooking recipes','AI-powered video editing with auto-captions effects and templates','Web development','Data analysis'],ans:1},{q:'What is Sora by OpenAI?',opts:['A music generator','A text-to-video AI model','A chatbot','A design tool'],ans:1}],
  'Notion Zapier Automation': [{q:'What is Notion primarily used for?',opts:['Video editing','All-in-one workspace for notes databases and project management','Email marketing','Web design'],ans:1},{q:'What is a Notion database?',opts:['A SQL database','A structured table in Notion for organizing information','A file storage','A spreadsheet app'],ans:1},{q:'What does Zapier do?',opts:['Design websites','Automates workflows by connecting different apps together','Manages databases','Sends emails directly'],ans:1},{q:'What is a Zap in Zapier?',opts:['An email','An automated workflow connecting a trigger to an action','A chat message','A report'],ans:1},{q:'What is the benefit of Notion templates?',opts:['Free storage','Pre-built page structures that save setup time','Extra features','Better design'],ans:1}]
};

export default function RegisterStudent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [upiId, setUpiId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Skill Choice
  const [selectedSkill, setSelectedSkill] = useState('');

  // Step 3: Skill Quiz
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Step 4: Success
  const [success, setSuccess] = useState(false);

  const handleStep1Submit = (e) => {
    e.preventDefault();
    setErr('');

    if (!name || !email || !phone || !college || !course || !year || !upiId || !password || !confirmPassword) {
      setErr('⚠️ Please fill all required fields!');
      return;
    }
    if (!email.includes('@')) {
      setErr('⚠️ Please enter a valid email address!');
      return;
    }
    if (phone.length < 10) {
      setErr('⚠️ Please enter a valid 10-digit WhatsApp number!');
      return;
    }
    if (password.length < 8) {
      setErr('⚠️ Password must be at least 8 characters!');
      return;
    }
    if (password !== confirmPassword) {
      setErr('⚠️ Passwords do not match!');
      return;
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startQuiz = () => {
    if (!selectedSkill) {
      setErr('⚠️ Please choose a skill!');
      return;
    }
    setErr('');

    // Fetch quiz questions based on selected skill
    // Safe fallbacks to random general questions if specific skill lacks them
    const qs = allQuestions[selectedSkill] || allQuestions['Web Development'];
    setQuizQuestions(qs);
    setUserAnswers({});
    setQuizSubmitted(false);
    setScore(0);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerSelect = (qIdx, oIdx) => {
    if (quizSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [qIdx]: oIdx
    }));
  };

  const handleQuizSubmit = () => {
    // Verify all 5 questions answered
    if (Object.keys(userAnswers).length < 5) {
      setErr('⚠️ Please answer all 5 questions first!');
      return;
    }
    setErr('');

    let calculatedScore = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.ans) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    setQuizSubmitted(true);

    // If score >= 3, celebrate with confetti!
    if (calculatedScore >= 3) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // Direct transition to final checkout
    setTimeout(() => {
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const getBadge = (scoreVal, skillVal) => {
    if (scoreVal === 5) return { label: `🥇 Expert — ${skillVal}`, cls: 'badge-gold', level: 'Expert' };
    if (scoreVal === 4) return { label: `🥈 Advanced — ${skillVal}`, cls: 'badge-silver', level: 'Advanced' };
    if (scoreVal === 3) return { label: `🥉 Intermediate — ${skillVal}`, cls: 'badge-bronze', level: 'Intermediate' };
    return { label: '📚 Beginner — Keep Practicing!', cls: 'badge-try', level: 'Beginner' };
  };

  const handleCompleteRegistration = async () => {
    setErr('');
    setLoading(true);

    const badge = getBadge(score, selectedSkill);
    const referCode = 'SN' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const data = {
      name: name,
      email: email.trim(),
      phone: phone.trim(),
      college: college.trim(),
      course: course,
      year: parseInt(year),
      skill: selectedSkill,
      password: password,
      upi_id: upiId.trim(),
      score: score,
      level: badge.level,
      badge: badge.label,
      refer_code: referCode,
      streak: 0,
      earnings: 0
    };

    try {
      const { error } = await supabase.from('students').insert([data]);
      if (error) {
        setErr(error.message.includes('duplicate') ? '⚠️ Email already registered!' : '⚠️ ' + error.message);
        setLoading(false);
        return;
      }
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setErr('⚠️ Something went wrong. Please try again!');
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    if (step === 1) return 'Basic Information';
    if (step === 2) return 'Choose Your Skill';
    if (step === 3) return 'Skill Test';
    return 'Complete Registration';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <BackgroundVideo skill={selectedSkill} />
      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
        <Link className="logo" to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div className="logo-circle"><span>SN</span></div>
          <span className="logo-name">Skill<em>Nux</em></span>
        </Link>
        <Link className="btn-ghost" to="/">← Back to Home</Link>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '100px 6% 60px', maxWidth: '680px', margin: '0 auto', width: '100%' }}>
        
        {/* Progress Header */}
        {!success && (
          <div className="progress-wrap">
            <div className="progress-steps">
              <div className={`ps-dot ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <div className={`ps-line ${step > 1 ? 'done' : ''}`}></div>
              <div className={`ps-dot ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <div className={`ps-line ${step > 2 ? 'done' : ''}`}></div>
              <div className={`ps-dot ${step >= 3 ? (step > 3 ? 'done' : 'active') : ''}`}>
                {step > 3 ? '✓' : '3'}
              </div>
              <div className={`ps-line ${step > 3 ? 'done' : ''}`}></div>
              <div className={`ps-dot ${step >= 4 ? 'active' : ''}`}>
                {step > 4 ? '✓' : '4'}
              </div>
            </div>
            <div className="progress-label">
              Step <span>{step}</span> of 4 — {getStepTitle()}
            </div>
          </div>
        )}

        {err && <div className="alert alert-error show" style={{ marginBottom: '20px' }}>{err}</div>}

        {/* STEP 1: Basic Info */}
        {!success && step === 1 && (
          <div className="card">
            <div className="card-title">👋 Tell Us About Yourself</div>
            <div className="card-sub">Fill in your basic details to create your SkillNux profile.</div>

            <form onSubmit={handleStep1Submit}>
              <div className="form-grid">
                <div className="form-group full">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    placeholder="Rohan Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    placeholder="rohan@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>WhatsApp Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group full">
                  <label>College Name *</label>
                  <input
                    type="text"
                    placeholder="XYZ College"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Course *</label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    required
                  >
                    <option value="">Select Course</option>
                    <option>B.Tech</option>
                    <option>BCA</option>
                    <option>BBA</option>
                    <option>B.Com</option>
                    <option>B.Sc</option>
                    <option>MBA</option>
                    <option>MCA</option>
                    <option>M.Tech</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>
                <div className="form-group full">
                  <label>UPI ID *</label>
                  <input
                    type="text"
                    placeholder="rohan@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                  <div className="form-hint">💰 This is where you will receive your earnings</div>
                </div>
                <div className="form-group full">
                  <label>Password *</label>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="form-hint">🔒 Use at least 8 characters</div>
                </div>
                <div className="form-group full">
                  <label>Confirm Password *</label>
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '24px' }}>
                Continue → Choose Your Skill
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Choose Skill */}
        {!success && step === 2 && (
          <div className="card">
            <div className="card-title">🎯 Choose Your Primary Skill</div>
            <div className="card-sub">Select the skill you want to get verified in. You will take a 5-question test!</div>

            <div style={{ marginTop: '20px' }}>
              {Object.keys(skillsList).map((cat) => {
                const icons = { 'Digital Marketing': '📣', 'Design & Creative': '🎨', 'Tech & Development': '💻', 'Business & Finance': '📊', 'AI & Automation': '🤖' };
                return (
                  <div className="skill-cat" key={cat}>
                    <div className="skill-cat-title">{icons[cat] || '✨'} {cat}</div>
                    <div className="skill-grid">
                      {skillsList[cat].map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          className={`skill-btn ${selectedSkill === skill ? 'selected' : ''}`}
                          onClick={() => { setSelectedSkill(skill); setErr(''); }}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1, marginTop: 0 }} onClick={() => setStep(1)}>
                ← Back
              </button>
              <button type="button" className="btn-primary" style={{ flex: 2, marginTop: 0 }} onClick={startQuiz}>
                Continue → Take Skill Test
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Skill Quiz */}
        {!success && step === 3 && (
          <div className="card">
            <div className="card-title">📝 Skill Test</div>
            <div className="card-sub">Skill: <strong style={{ color: 'var(--cyan)' }}>{selectedSkill}</strong> — Answer all 5 questions!</div>

            <div style={{ marginTop: '24px' }}>
              {quizQuestions.map((q, qIdx) => (
                <div className="question-wrap" key={qIdx}>
                  <div className="q-number">Question {qIdx + 1} of 5</div>
                  <div className="q-text">{q.q}</div>
                  <div className="options">
                    {q.opts.map((opt, oIdx) => {
                      const isSelected = userAnswers[qIdx] === oIdx;
                      const isCorrect = q.ans === oIdx;
                      
                      let btnCls = '';
                      if (quizSubmitted) {
                        if (isSelected && isCorrect) btnCls = 'correct';
                        else if (isSelected && !isCorrect) btnCls = 'wrong';
                        else if (isCorrect) btnCls = 'correct';
                      } else {
                        if (isSelected) btnCls = 'selected';
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          className={`opt ${btnCls}`}
                          onClick={() => handleAnswerSelect(qIdx, oIdx)}
                          disabled={quizSubmitted}
                        >
                          <span className="opt-letter">{['A', 'B', 'C', 'D'][oIdx]}</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {!quizSubmitted ? (
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, marginTop: 0 }} onClick={() => setStep(2)}>
                  ← Back
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ flex: 2, marginTop: 0 }}
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(userAnswers).length < 5}
                >
                  Submit Test →
                </button>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--muted-dark)', marginTop: '20px', fontStyle: 'italic' }}>
                Evaluating score, redirecting to result...
              </p>
            )}
          </div>
        )}

        {/* STEP 4: Complete Registration */}
        {!success && step === 4 && (
          <div className="card">
            <div className="score-wrap">
              <div className="score-num">{score}/5</div>
              <div className={`score-badge ${getBadge(score, selectedSkill).cls}`}>
                {getBadge(score, selectedSkill).label}
              </div>
              <p style={{ color: 'var(--muted-dark)', fontSize: '14px', margin: '12px auto', maxWidth: '380px', lineHeight: '1.6' }}>
                {score >= 3 ? '🎉 Great job! You passed the skill test and earned your verified skill badge!' : '📚 Keep practicing! You can retake the test at any time in your dashboard.'}
              </p>
              <p style={{ color: 'var(--muted-dark)', fontSize: '13px' }}>
                Verified Skill: <strong style={{ color: 'var(--cyan)' }}>{selectedSkill}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1, marginTop: 0 }} onClick={() => setStep(3)}>
                ← Review Answers
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 2, marginTop: 0 }}
                onClick={handleCompleteRegistration}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading"></span> Creating profile...
                  </>
                ) : (
                  '🚀 Complete Registration'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success screen */}
        {success && (
          <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
            <div className="card-title">Welcome to SkillNux!</div>
            <p style={{ color: 'var(--muted-dark)', margin: '12px 0 24px', lineHeight: '1.7' }}>
              Profile created successfully! We will review your verified details and activate your account within 24 hours.
            </p>
            <div style={{ background: 'rgba(0,201,200,0.08)', border: '1px solid rgba(0,201,200,0.2)', borderRadius: '12px', padding: '16px', marginBottom: '24px', fontSize: '13px', color: 'var(--muted-dark)' }}>
              📱 Check your portal dashboard to complete your details and view open projects!
            </div>
            <button onClick={() => navigate('/login')} className="btn-primary" style={{ display: 'block', width: '100%' }}>
              🔑 Go to Login Dashboard
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
