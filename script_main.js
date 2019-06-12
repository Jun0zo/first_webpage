// 비동기로 json파일 불러오기 1. cup_leage  2.team 전체

//==============================. 변수 정의. =================================
var max = 3;
var index = 0;
var is_scroll_state_up = 1;
var cur_section = -1, bef_section = -2;
var is_section_change = -1;
var cup_list, team_list;
var cur_team_index_front = 0;
var cur_team_index_back = 4;


var global_player_infos;
var global_team_infos;
//alert('f');
//==============================. 함수 정의. =================================
function getIndex(target){

	var targetR = target.parent();
	//alert ('? : ' + $('#team_img_list li').eq(0).html());
	for(var i = 0; i < ('#team_img_list li').length; i++){
		if( $('#team_img_list li').eq(i).html() === targetR.html())
			return i;
	}

}

function chkScrLoc (id, lev){	//스크롤 확인 함수
	if($(document).scrollTop() > $(id).offset().top + lev)
		return 1;
	else 
		return 0;
}

function clearID(list){	//id값 모두삭제하는 함수
	list.each(function (){
		 $(this).removeAttr('id');
	});
}

function hideAll(list){

	list.each(function(index, item){
		if(index >= 5){
			$(item).css({opacity : 0.0});
		}
	});
}

function highLight(string){
	var result = '<h3>';
	for(var i = 0; i<string.length; i++){
		if(i==0)
			result += '<span>' + string[i] + '</span>';
		else if(string[i-1] == ' ')
			result += '<span>' + string[i] + '</span>';
		else
			result += string[i];
	}

	result += '</h3>';
	return result;
}

function imgSlide(x_pos_diff, diff, to){
	//----------------      왼쪽으로 이동. <--    -----------------
	$('#team_content_3 h3').remove();
	if(to === 'L'){
		var max = 10000;
		if(cur_team_index_back + diff > max)
			diff = max - cur_team_index_front;
		$('#team_img_list').animate({'margin-left' : "-=" + x_pos_diff * diff }, 500);
		for(var i = 0; i < diff; i++){
			for(var index=0; index<=5; index++){ //현재 바라보고 있는 인덱스 모두 순회
				var cur_img = $('.team_img').eq(index + cur_team_index_front);
				if(index == 0)
					$(cur_img).css({opacity : 0.0}); //마지막인덱스는 사라짐
				else if(index == 2)
					$(cur_img).removeAttr('id'); //중간값에서 작아지게
				else if(index == 3)
					$(cur_img).attr({id : 'team_img_middle'});  //중간값이면 커지게
				else if(index == 5)
					$(cur_img).css({opacity : 1.0}); //나오는 이미지는 fadeIn처리
			}
			cur_team_index_front += 1;
		}

		var target_team_name = team_list.PremierLeague[cur_team_index_front + 2];
		target_team_name = highLight(target_team_name);
		$('#team_content_3').prepend($(target_team_name));

	}
	    //----------------       오른쪽으로 이동. -->.    -----------------
	else if(to === 'R'){
		var min = 0;
		if(cur_team_index_back + diff < min)
			diff = cur_team_index_front- min;
		$('#team_img_list').animate({'margin-left' : "+=" + x_pos_diff * diff}, 500);
		for(var i = 0; i < diff; i++){
			for(var index=0; index<=5; index++){   //현재 바라보고 있는 인덱스 모두 순회
				var cur_img = $('.team_img').eq(index + cur_team_index_front);
				if(index == 1)
					$(cur_img).attr({id : 'team_img_middle'}); //중간값이면 커지게
				else if(index == 2)
					$(cur_img).removeAttr('id'); // 중간값에서 작아지게
				else if(index == 4)
					$(cur_img).css({opacity : 0.0}); //마지막인덱스는 사라짐

				$('.team_img').eq(cur_team_index_front - 1).css({opacity : 1.0}); //나오는 이미지는 fadeIn처리
			}
			cur_team_index_front -= 1;
		}
		var target_team_name = team_list.PremierLeague[cur_team_index_front + 2];
		target_team_name = highLight(target_team_name);
		$('#team_content_3').prepend($(target_team_name));
	}
}

function replaceAll(str, searchStr, replaceStr){   //문자열 전체변환 함수
	return str.split(searchStr).join(replaceStr)
}

function strToSrc(location, str, format){ //상대경로 반환하는 함수
	str = str.toLowerCase(str)
	str = replaceAll(str, ' ', '_') + '.' + format;
	str = location + str;
	return str;
}

function isExistence(object){   //객체존재여부 반환하는 함수
	if(object.length > 0)
		return true;
	else
		return false;
}

function drawGraph(name, labels_names, labels_datas){
	var canvas = $('#stat_canvas');
	
	Chart.defaults.global.defaultFontFamily = "Lato";
	Chart.defaults.global.defaultFontSize = 18;
			
	var marksData = {
		labels: labels_names,
		datasets: [{
			label: name,
			backgroundColor: "rgba(244, 123, 315, 0.3)",
			borderColor: "rgba(200,0,0,0.6)",
			fill: true,
			radius: 6,
			pointRadius: 0,  //포인트 크기조절
			pointBorderWidth: 3,
			pointBackgroundColor: "orange",
			pointBorderColor: "rgba(200,0,0,0.6)",
			pointHoverRadius: 10,
			data: labels_datas
		}]
	};
			
	var chartOptions = {
		scale: {
			gridLines: {
				color: "black",
				lineWidth: 1
			},
			angleLines: {
				display: false
			},
			ticks: {
				beginAtZero: true,
				min: 0,
				max: 100,
				stepSize: 20
			},
				pointLabels: {
				fontSize: 18,
				fontColor: "green"
			}
		},
			legend: {
				position: 'right'
			},
			maintainAspectRatio: false,
			animationEnabled: true,
			animationEasing: 'easeInOutQuart',
			animationSteps: 10
		};
		
			var radarChart = new Chart(canvas, {
			type: 'radar',
			data: marksData,
			options: chartOptions,
		});
}

function calcGraph (stat_list) {
	$.ajaxSetup({ async: false });
	$.ajax({
		type:'GET',
		url:'/player/' + '*',
			success : function(player_infos) {
				result_data_set = {"GK":[0,0,0,0,0], "DF":[0,0,0,0,0], "MF":[0,0,0,0,0], "FW":[0,0,0,0,0]};
				global_player_full_infos = player_infos;
				//alert(global_player_full_infos.length);
				$.each(global_player_full_infos, function(index, player_info) {
					//sum = sum + player_info.stat_list[index];
					if (player_info.position == "Goalkeeper") {
						
						result_data_set["GK"][0] += Number(player_info.Saves.replace(',', ''));
						result_data_set["GK"][1] += Number(player_info.Saves.replace(',', ''));
						result_data_set["GK"][2] += Number(player_info.Penalties_saved.replace(',', ''));
						result_data_set["GK"][3] += Number(player_info.High_Claims.replace(',', ''));
						result_data_set["GK"][4] += Number(player_info.Goal_kicks.replace(',', ''));
					}
					else if (player_info.position == "Defender") {
						result_data_set["DF"][1] += Number(player_info.Aerial_battles_lost.replace(',', ''));
						result_data_set["DF"][1] += Number(player_info.Tackles.replace(',', ''));
						result_data_set["DF"][2] += Number(player_info.Accurate_long_ball.replace(',', ''));
						result_data_set["DF"][3] += Number(player_info.Interceptions.replace(',', ''));
						result_data_set["DF"][4] += Number(player_info.Passes.replace(',', ''));
					}
					else if (player_info.position == "Midfielder") {
						result_data_set["MF"][1] += Number(player_info.Saves.replace(',', ''));
						result_data_set["MF"][2] += Number(player_info.Penalties_saved.replace(',', ''));
						result_data_set["MF"][3] += Number(player_info.High_Claims.replace(',', ''));
						result_data_set["MF"][4] += Number(player_info.Goal_kicks.replace(',', ''));
					}
					else if (player_info.position == "Forward") {
						result_data_set["FW"][1] += Number(player_info.Saves.replace(',', ''));
						result_data_set["FW"][2] += Number(player_info.Penalties_saved.replace(',', ''));
						result_data_set["FW"][3] += Number(player_info.High_Claims.replace(',', ''));
						result_data_set["FW"][4] += Number(player_info.Goal_kicks.replace(',', ''));
					}
				})

				alert(result_data_set["GK"][0]);
			}
		});
		
		$.ajax({
			type:'GET',
			url:'/team/' + team_name,
			success : function(team_infos) {
				global_team_full_infos = team_infos;
			}


		});
	$.ajaxSetup({ async: true });
	
		
	
}

//============================================= 시작 부분 ===============================================================

$(document).ready(function() {

	//==============================. 데이터 전처리. =================================

		//------------------. json파일 import. ------------------
		$.getJSON('/data/cup_list.json', function(data){
			cup_list = data;
			$('.cup_image').attr({src :'/images/cup_icon/' + cup_list.cup[0].logo_file});
			$('#cup_pg_bar_1').animate({width: cup_list.cup[0].speed + '%'});
			$('#cup_pg_bar_2').animate({width: cup_list.cup[0].build + '%'});
			$('#cup_pg_bar_3').animate({width: cup_list.cup[0].skill + '%'});
		});

		//------------------. team_list 이미지 적용. ------------------
		$.ajaxSetup({ async: false });
		$.getJSON('/data/team_list.json', function(data){
			team_list = data;
			team_list_reversed = $(team_list.PremierLeague).get().reverse();  //미리 데이터 로딩
			$(team_list_reversed).each(function(index, data){
				var next = `<li><img class="team_img" src="` + strToSrc('/images/club_icon/epl/', data, 'png') + `" name="team_name" value="${data}"></li>`;  //이미지 파일 로드
				$('#team_img_list').prepend($(next));
			})
			//onClick="document.forms['player'].submit();"
			$('.team_img').eq(2).attr({id : 'team_img_middle'});  //중간 요소 크기조정

			var first_setting = highLight(team_list.PremierLeague[2]);
			$('#team_content_3').prepend($(first_setting));
		});

	//------------------. team_img 부분 음영처리 ------------------
	hideAll( $('.team_img') );
	var img_list = $('#team_img_list li');
	var cur_window_width = window.innerWidth;
	//alert(window.innerWidth)
	var des_offset = cur_window_width/2 - 125;
	var cur_midle_offset = $(img_list[2]).offset().left;
	var diff_offset = des_offset - cur_midle_offset;
	//alert()
	alert(Math.abs(diff_offset));
	 
	 $('#team_img_list').css({"margin-left": Math.abs(diff_offset) +100});

	

	$.ajaxSetup({ async: true });
	//==============================. 스크롤 시. =================================
	$(window).scroll( function() {

		//----------------. 메뉴바 고정. ----------------
		if( $(document).scrollTop() >  35){
			$('#menu_bar_id').addClass('menu_bar_fixed');
		} else{
			$('#menu_bar_id').removeClass('menu_bar_fixed');
		}

		//----------------. about글씨 애니메이션. ----------------
		var about_dc_Offset = $('#about').offset();
		if( $(document).scrollTop() > about_dc_Offset.top - 400 && $(document).scrollTop() < about_dc_Offset.top + 400 ){
			$('#about_describe').removeClass('slideout');
			$('#about_describe').addClass('slidein');
		}

		else{
			$('#about_describe').removeClass('slidein');
			$('#about_describe').addClass('slideout');
		}

		//alert(typeof $('.menu_items')[2]);
		//----------------.  about section 부분 li 색변경. ----------------
		//배열 접근 : alert($('.menu_items').toArray()[0] );
		if( chkScrLoc('#game', -300) ){
			cur_section = 4;
			if(cur_section != bef_section){
				clearID($('.menu_items'));
				bef_section = cur_section;
				var menu_name_game = $('.menu_items').toArray()[4];
				$(menu_name_game).attr({id : 'menu_bar_fixed_clicked'})
			}
			
		//----------------.  about section 부분 li 색변경. ----------------
		} else if( chkScrLoc('#team', -300) ){
			cur_section = 3;
			if(cur_section != bef_section){
				clearID($('.menu_items'));
				bef_section = cur_section;
				var menu_name_game = $('.menu_items').toArray()[3];
				$(menu_name_game).attr({id : 'menu_bar_fixed_clicked'})
			}
		//----------------.  about section 부분 li 색변경. ----------------
		} else if( chkScrLoc('#cup', -300) ){
			cur_section = 2;
			if(cur_section != bef_section){
				clearID($('.menu_items'));
				bef_section = cur_section;
				var menu_name_game = $('.menu_items').toArray()[2];
				$(menu_name_game).attr({id : 'menu_bar_fixed_clicked'});
			}
		//----------------.  about section 부분 li 색변경. ----------------
		} else if( chkScrLoc('#about', -300) ){
			cur_section = 1;
			if(cur_section != bef_section){
				clearID($('.menu_items'));
				bef_section = cur_section;
				var menu_name_game = $('.menu_items').toArray()[1];
				$(menu_name_game).attr({id : 'menu_bar_fixed_clicked'})
			}
		//----------------.  about section 부분 li 색변경. ----------------
		} else {
			cur_section = 0;
			if(cur_section != bef_section){
				clearID($('.menu_items'));
				bef_section = cur_section;
				var menu_name_game = $('.menu_items').toArray()[0];
				$(menu_name_game).attr({id : 'menu_bar_fixed_clicked'})
			}
		}
	});

	//==============================. 메뉴 클릭 시 애니메이션. =================================
	$('.menu_items').click(function(event){
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top}, 700);
	});

	//=============================  cup_list에서 화살표 클릭시 리그 정보 변경. =================================

	//----------------.  index 변경. ----------------
	$('.cup_image_change').click(function(event){
		event.preventDefault();
		var first = $('.cup_image_change')[0];
		var second = $('.cup_image_change')[1];

		if(event.target === first){
			if(index == 0)
				index = max-1;
			else
				index--;
		}
		else if(event.target === second){
			if(index == max-1)
				index = 0;
			else
				index++;
		}
		//----------------.  글자부분 변경. ----------------
		$('#league_name p').text(cup_list.cup[index].name);
		$('#country_name img').attr({
										src : '/images/country_icon/'+ cup_list.cup[index].country_file,
										style : 'width:230px; height:154px; margin:25px;'}
									);
		$('#country_name p').text(cup_list.cup[index].country);

		//----------------.  link파일 위치 변경. ----------------
		$('.cup_image').attr({src : '/images/cup_icon/' + cup_list.cup[index].logo_file});

		//----------------.  progress bar 정보 변경. ----------------
		$('#cup_pg_bar_1').animate({width : cup_list.cup[index].speed + '%'});
		$('#cup_pg_bar_2').animate({width : cup_list.cup[index].build + '%'});
		$('#cup_pg_bar_3').animate({width : cup_list.cup[index].skill + '%'});

	});

	//=============================  team_list에서 select태그 꾸미기. =================================
	$('#team_select').change(function() {
		var select_name = $(this).children('option:selected').text();
		$(this).siblings('label').text(select_name);
		
	})

	//=============================  team_list에서 슬라이드 구현. =================================
	$('.team_img').click(function(event){
		var first_li = $('#team_img_list li').eq(0 + cur_team_index_front);
		var first_img_list = $('#team_img_list li').eq(0 + cur_team_index_front);
		var last_li = $('#team_img_list li').eq(4 + cur_team_index_front);
		var last_img = $('.team_img').eq(4 + cur_team_index_front);
		var x_pos_diff = $( $('#team_img_list li').eq(1 + cur_team_index_front) ).position().left - $(first_img_list).position().left; //150.5
		//alert(x_pos_diff);
		var clicked_index = getIndex($(event.target));
		var middle_index = 2+cur_team_index_front
		var index_diff = Math.abs(clicked_index - middle_index);

		if(clicked_index < middle_index){ //중간보다 왼쪽클릭
			imgSlide(x_pos_diff , index_diff, 'R');
		}
		else if(clicked_index > middle_index){ //중간보다 오른쪽 클릭
			imgSlide(x_pos_diff , index_diff, 'L');
		}
		else{ //가운데 클릭
			$('#team_modal').css({visibility:"visible"});
			$('#team_modal_content').css({visibility: "visible"});
			$('#team_modal_content').addClass('modal_come_in'); 

			$('.team_button').css('visibility', 'visible');
			$('.player_button').css('visibility', 'visible');

			var team_name = $('#team_content_3 h3').text();
			$('#pop_up_title').text(team_name.toUpperCase());
			$.ajax({
				type:'GET',
				url:'/player/' + team_name,
				success : function(player_infos) {

					var html_add = '';
					var n = Object.keys(player_infos).length;
					$('#player_list').css({width : String(n * 215) + 'px'});
					var default_img = strToSrc('/images/club_icon/epl/', team_name, 'png');
					$('#player_main_img').attr('src', default_img);
					$.each(player_infos, function(index, player_info) {
						var player_img_src = player_info.img_src;
						var player_name = player_info.name;
						html_add += `<li class="players"> <div id="player_img_cover"><img src="${player_img_src}"></div> ${player_name.replace('_',' ')} </li>`;
					});
					$('#player_list').prepend(html_add); //선수 목록 추가
					global_player_infos = player_infos;
				}
			});

			$.ajax({
				type:'GET',
				url:'/team/' + team_name,
				success : function(team_infos) {
					var html_add = '';
					//$('team_stat span')[0].text(team_infos[0].name);
					var team_stat_list = $('.team_stat');
					
					//alert(team_infos[0].name);
					$(team_stat_list[0]).children(':eq(1)').text(team_infos[0].matches_played);
					$(team_stat_list[1]).children(':eq(1)').text(team_infos[0].goals);
					$(team_stat_list[2]).children(':eq(1)').text(team_infos[0].clean_sheets);
					$(team_stat_list[3]).children(':eq(1)').text(team_infos[0].win);
					$(team_stat_list[4]).children(':eq(1)').text(team_infos[0].losses);
					global_team_infos = team_infos;
				}
			});
			
			$.ajaxSetup({ async: true });
			
			alert(global_team_infos[0].Shots);
			alert(global_team_infos[0].Passes_per_match);

			
			draw_graph(team_name, ["Shots", "Passes/match", "Clearance", "Chemist", "Saves"],
					[global_team_infos[0].Shots,
					global_team_infos[0].Passes_per_match,70,57,60]);
		}
	});

	$(window).resize(function () {
		hideAll( $('.team_img') );
		var img_list = $('#team_img_list li');
		var cur_window_width = $(window).width();
		//alert($(window).width())
		var des_offset = cur_window_width/2 ;
		var cur_midle_offset = $(img_list[2]).offset().left - $(img_list[0]).height()/2;
		var diff_offset = des_offset - cur_midle_offset - $(img_list[2]).css('width') / 2;
		
		$('#team_img_list').css({"margin-left":diff_offset + 300});
	})

	//=============================  팝업창 동작 구현. =================================

	//----------------.  team_list 불러오기 . ----------------
	$('.team_button').click(function() {  //team_stat 불러오기
		if( $('#team_stats').css('display') == 'none'){ //없을때
	
			$('#team_modal_content').animate({'height':'73%'}, 1000 ,function () {
				if($('#player_list_wrap').css('display') == 'block')
					$('#player_list_wrap').css('display', 'none'); //콜백함수
				$('#team_stats').css('display', 'block'); //콜백함수
			});
		}
		else{ //있을때
			$('#team_stats').css('display', 'none');
			$('#team_modal_content').animate({'height':'40%'}, 1000 );
		}
	});

	$('.player_button').click(function() {  //player_stat 불러오기 
		if( $('#player_list_wrap').css('display') == 'none'){ //없을때
			$('#team_modal_content').animate({'height':'73%'}, 1000 ,function () {
				if($('#team_stats').css('display') == 'block')
					$('#team_stats').css('display','none');
				$('#player_list_wrap').css('display', 'block'); //콜백함수
			});
		}
		else{ //있을때
			$('#player_list_wrap').css('display', 'none');
			$('#team_modal_content').animate({'height':'40%'}, 1000);
		}
	});

	$('#menu_select div').click(function (){
		if($(this).attr('id')) {
			$(this).removeAttr('id');
		}
		else{
			$(this).attr({'id':'button_clicked'});
		}
	});

	//----------------.  닫기 구현. ----------------
	$('.close').click(function(){
		$('.team_button').css('visibility', 'hidden');
		$('.player_button').css('visibility', 'hidden');
		$('.players').remove();  //선수목록 삭제
		$('#player_list_wrap').css('display', 'none');   //추가정보 창 모두 없애기
		$('#team_stats').css('display', 'none');

		$('#team_modal_content').css('height','40%');  //모델창 크기 줄이기

		$('.player_button').removeAttr('id');  //클릭된 버튼 초기화 
		$('.team_button').removeAttr('id');

		$('#team_modal_content').removeClass('modal_come_in'); //흰색 모델창 && 모델창 삭제
		$('#team_modal_content').css('visibility', "hidden");
		$('#team_modal').css('visibility', "hidden");
	});




});	