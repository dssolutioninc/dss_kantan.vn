
<h1>JapTool project collaboration guide</h1>

<h2>1. Git-branch Branching strategy</h2>

<h3>master branch</h3>
master branch is base brach for developing. When implement new feature, clone master branch and start developing.

<h3>dummy branch</h3>
to avoid miss of push, dummy brach is created and setted as default branch.


<h3>doc branch</h3>
doc branch is used for sharing requirement & management documents.


<h3>feature branches</h3>
Branches are created for the development of each function. Currently has the following branches
<ul>

  <li>vocabulary : for vocabulary leaning feature</li>
  <li>test: for question and check feature</li>
  <li>user: for sign-in and signup feature</li>
  <li>speech: for speech recognition feature</li>
 <li>home : for home page and modules base on home page</li>
  <li>library: for library feature</li>
  <li>learning: for learning feature</li>


</ul>

<h2>2. Using cases </h2>
<h3>2.1 Start developing new feature</h3>
clone from master brach <br>
<code>git clone -b master https://github.com/tugigroup/japtool.git</code><br>
<code>cd japtool</code><br>

create new feature brach. test branch for example<br>
<code>git checkout -b test</code>

push new brach to github repository<br>
<code>git push origin test</code>

<br>
in the period of development, push source to feature branch daily.
<br>
<code>git add .</code><br>
<code>git commit -m “insert your comment for update here”</code><br>
push change your branch on github repository. test branch for example<br>
<code>git push origin test</code><br>

<h3>2.2 Get latest source from github repository overwrite local version</h3>
When there is something wrong in the local version, and you want to quick fix by get latest from github repository, follow these steps
<br>
<code>git fetch origin</code><br>
for example you want to get latest from test feature<br>
<code>git reset —hard origin/test</code><br>

<h3>2.3 Try running project in local</h3>
for example you want to try running master brach version source on local <br>
<code>git clone -b master https://github.com/tugigroup/japtool.git</code><br>
<code>cd japtool</code><br>
<code>npm install</code><br>
change database connection to fit with your local enviroment in config/connection.js file.<br>
Then launch your app. <br>
<code>sails lift</code><br>


<h3>2.4 Merge master branch into your source</h3>

get latest to HEAD on local<br>
<code>git fetch</code><br>
change to your branch. For example test feature branch<br>
<code>git checkout test</code><br>
check current branch. You need standing in your branch.<br>
<code>git branch</code><br>
merge master branch into your current branch<br>
<code>git merge origin/master</code><br>
<br>

Git does not automatically merge if conflig. You need to handle manually conflig.
"hello" 
