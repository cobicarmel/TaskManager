<div id="as-datetime" class="as-bar tahoma">
	<div id="dt-day" class="dt-label caption"></div>
	<div id="dt-date" class="dt-label caption"></div>
	<div id="dt-time" class="dt-label caption"></div>
</div>
<div id="user" class="as-bar">
	<div id="user-label" class="caption">
		<span class="ui-icon ui-icon-person"></span>
	</div>
	<span id="user-name"><?=USERNAME?></span>
	<div id="logout" class="caption">
		<a href="login/login.lib.php?logout"><?=$LOCAL[67]?></a>
	</div>
</div>
<div id="today" class="as-bar">
	<h4 class="caption"><?=$LOCAL[1]?>:</h4>
	<div>
		<table id="today-agenda"></table>
	</div>
	<h4 class="caption"><?=$LOCAL[17]?>:</h4>
	<div>
		<table id="soon"></table>
	</div>
</div>
<div id="menu" class="as-bar">
	<div class="menu-tab" tab="table-time"><?=$LOCAL[6]?></div>
	<div class="menu-tab" tab="calendar"><?=$LOCAL[0]?></div>
	<div class="menu-tab" tab="client"><?=$LOCAL[2]?></div>
	<div class="menu-tab" tab=""><?=$LOCAL[50]?></div>
	<div class="menu-tab"><?=$LOCAL[3]?></div>
</div>