# Blog post Migration from wordpress to next.js

I want to extract all blog posts from an old wordpress website into this project.

# 1 - stage

we will scrape all the data from the old website into a file `data/blog.ts` - We will use this file as "database" and store all the posts in an object array ("something like a json").
There are 44 published posts on the old website. 3 drafts. We will only migrate the published ones.
Some posts have comments and I want to scrape that data - even if I might not have comment function enable in this new site, the comments on the old blog are part of the content. Some posts have more than 150 comments. We need to keep all the nested comments structure, the user names, profile links, but the users avatar images we will copy and store it on a folder in `public/`.

# Migration strategy

The old blog is already a submodule of this project located in @project_archive/devhouse-wordpress/  

The old blog posts data can be read 4 different ways. I want you to define the easier or faster or more precise or convenient way. Here are the 3 options:

1 - Scrape the web: The website is running on a container on `http://localhost:8080/blog`. 
    pros: 
    - is that it is assembled exactly the way I expect. 
    - it is a working copy of all the data inside the html and all the assets are accessible, even the external ones like avatar images.
    cons:
    - The container is very slow (problem with running it with windows 11 and wsl2)

2 - Scrape the already httrack scraped version (my prefered): I used httrack to scrape and save all the website html files. It is located in @project_archive/devhouse-wordpress/rip/  - the website is @project_archive/devhouse-wordpress/rip/site/ and the blog is @project_archive/devhouse-wordpress/rip/site/blog/index.html - Posts have their folder directly under `site/` not under `site/blog/`. 
     pros:
     - It is faster
     - It might have all the assets already downloaded
    cons:
    - Lots of files
    - httrack might have changed something - although what it changed it is still on the rip folder.
    - too much unecessary and repetitive html.

3 - Scrape the mysql dump file: I created a backup on @project_archive/devhouse-wordpress/db/devhouse_backup_20260623_052913.sql 
    pros: 
    - One file
    cons:
    - you will have to reassemble the relations

4 - Query mysql directly from the container: You can read @project_archive/devhouse-wordpress/docker-compose.yml for more information.

*** you can use a mix of this strategies to scrape the data ***

- the wordpress files are also a source of information: @project_archive/devhouse-wordpress/www/ 

# Data to migrate

I'll let you analyse it and put it on the plan.
*** you will have to add to the plan a strategy to store images into the next.js `public/` folder - even external images, because the new next.js blog section will have to reflect a snapshot of the current state of the old wordpress website (including all images) ***

# Post content and data structure

- I will write new blog posts and the structure of the new `data/blog.ts` will be edited and changed by me to add new blog posts.
- I'm thinking in converting the old wordpress content html structure into markdown
- all posts have a featured image
- posts should be ordered by date
- posts should have a featured flag to pin on top of the page

# syntax highlighting

Several of my posts have code blocks with syntax hightlighting - using the wordpress plugin "SyntaxHighlighter Evolved" version 3.2.1 with the color theme midnight (this will be relevant to recreating the sintax highlight look and feel on react). I want to keep the same functionality and looks for my posts. (If converting it to markdown need to pay attention to this - three backticks)
Directly on the database the code secitons are defined by:  `[bash] CODE_HERE [/bash]` - if bash script.
this is converted to html to `<pre class="brush: bash; title: ; notranslate" title=""> CODE_HERE </pre>`

- You have to be aware of the square brackets syntax for plugins inside the content. 
For the syntax hightlight these are the possible variations:

"Brush name"	"Brush aliases"
"Bash/shell"	"bash, shell"
"C#"        	"c-sharp, csharp"
"C++"       	"cpp, c"
"CSS"       	"css"
"Delphi"    	"delphi, pas, pascal"
"Diff"      	"diff, patch"
"Groovy"    	"groovy"
"JavaScript"	"js, jscript, javascript"
"Java"      	"java"
"PHP"       	"php"
"Plain Text"	"plain, text"
"Python"    	"py, python"
"Ruby"      	"rails, ror, ruby"
"SQL"       	"sql"
"Visual Basic"	"vb, vbnet"
"XML"       	"xml, xhtml, xslt, html, xhtml"

the variations are described in this link:
`https://web.archive.org/web/20090207053608/http://alexgorbatchev.com/wiki/SyntaxHighlighter:Brushes`

 *** any other code between square brackets must be treated as other plugin call and you must ask me how to handle them ***