jQuery.extend(jQuery.easing, {
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	}
});

$(document).ready(function(){

//#1.set up and create the progress bar
	let $h2 = $('h2')
	$h2.eq(0).before('<div class="progressbar"></div>')

	let $container = $('.progressbar')
	$container.append('<div class="shim"></div>')
	$container.append('<div class="holder clearfix"></div>')

	let $shim = $('.progressbar .shim')
	let $holder = $(".progressbar .holder")
	$holder.append('<div class="bar"></div>')
	$holder.append('<div class="labels"></div>')
	let $bar = $('.progressbar .bar')
	$bar.append('<div class="indicator"></div>')
	let $indicator = $(".progressbar .indicator")
	let $labels = $(".progressbar .labels")

	$h2.each(function(){
		let code = '<i data-label=' + $(this).text() + '></i>'
		$labels.append(code)
	})

	let $points = $labels.find('i')
	let $point = $points.eq(0)
	$points.css('width',100/$points.length +'%')

//#2. set the height of shim to stop layput jumping when .container change to fixes/unfixes
	function setShimHeight(){
		$shim.css('height',$container.height()+'px')
	}
	setShimHeight()
	$(window).resize(setShimHeight)


//#3. set .indicator start position and change it when the window resize
	function setIndicatorX(){
		var offset = $point.offset().left + $point.width()/2
		$indicator.css('left',offset+'px')
	}
	setIndicatorX()
	$(window).resize(setIndicatorX)

//#4. fix/unfix the progressbar to the top of the viewport
	 function fixPosition(){
	 	if($container.is(':visible')){
	 		let scrollY = $(window).scrollTop()
	 		//if .container fixes,the scrollY == $holder.offset().top
	 		if(!$container.hasClass('fixed')){
	 			if(scrollY >= $holder.offset().top){
	 				$container.addClass('fixed')
	 			}
	 		}else{
	 			if(scrollY < $shim.offset().top){
	 				$container.removeClass('fixed')
	 			}
	 		}
	 	}
	 }
	$(window).scroll(fixPosition)

//set trigger point
	var triggerPoint = 0;
	function setTriggerPoint(){
		triggerPoint = $(window).height() * .18;
	}
	setTriggerPoint();
	$(window).resize(setTriggerPoint);

//#5. update progress bar
	function setPosition(){
		if($container.is(':visible')){
			let section  = -1
			let sectionIndex = 0
			let currentPos = $(window).scrollTop()+triggerPoint

			// if before first section,
			if(currentPos < $h2.eq(0).offset().top){
				$points.removeClass('reading read')
			}
			//if after first section
			$h2.each(function(){
				let sectionPos = $(this).offset().top
				if(currentPos >= sectionPos){
					$points.removeClass('reading')
					$points.eq(sectionIndex).addClass('reading read')
					section  = sectionIndex
				}else{
					$points.eq(sectionIndex).removeClass('read')
				}
				sectionIndex++;
			})

			//set the indicator width
			let barWidth = 0
			let pointWidth = $point.width()

			if(section == -1){
				barWidth = 0
			}else if(section == $h2.length-1){
				barWidth = pointWidth*section
			}else{
				let startSection = $h2.eq(section).offset().top
				let endSection = $h2.eq(section+1).offset().top
				let totalLength = endSection - startSection
				let scrollY = currentPos - startSection
				barWidth = scrollY/totalLength*pointWidth + pointWidth*section
			}
			
			$indicator.css('width',barWidth+'px')
		}
	}
	$(window).scroll(setPosition)

	$points.click(function(){
		let index = $points.index($(this))
		let targetY = $h2.eq(index).offset().top - (triggerPoint * .92)
		$('html,body').animate({scrollTop:targetY},600,'easeInOutCubic')
	})

})