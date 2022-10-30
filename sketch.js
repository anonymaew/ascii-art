let img,fnt,imgname;
let textarr=" !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
let fs=6,fw,fh,val=[],fmn,fmx;
let finished=false;
let res=[];

function preload(){
	fnt=loadFont("consolab.ttf");
}

function setup(){
  let cv=createCanvas(1280,1280);
  cv.parent("can");

  fill(0);
}

function draw(){
}

function thispixel(x,y){
	return pixels[4*(x+y*width)]*0.3+pixels[4*(x+y*width)+1]*0.6+pixels[4*(x+y*width)+2]*0.1;
}

function findval(){
	if(fs<4 || fs>12) return;

	textFont(fnt); textSize(fs);
	fw=textWidth("a");
	fh=textDescent()+textAscent();
	textLeading(fh);
	pixelDensity(1);
	fmn=999999999; fmx=0;

	background(255);
	fill(0);
	text(textarr,0,textAscent());
	loadPixels();
	for(let i=0;i<95;i++){
		val[i]=0;
		for(let x=int(fw*i);x<int(fw*(i+1));x++) for(let y=0;y<fh;y++) val[i]+=255-thispixel(x,y);
		if(val[i]<fmn) fmn=val[i]; if(val[i]>fmx) fmx=val[i];
	}
	background(255);
	document.getElementById("loading").style.display="block";
	setTimeout(() => {  writechar(), 100});
}

function grayimg(inp){
	loadImage(URL.createObjectURL(inp.files[0]),im=>{
		imgname=inp.files[0].name.split('.')[0]+"-Stringified.txt"
		im.loadPixels();
		for(let i=0;i<im.width;i++) for(let j=0;j<im.height;j++){
			let ic=(im.pixels[4*(i+im.width*j)]*0.3+im.pixels[4*(i+im.width*j)+1]*0.6+im.pixels[4*(i+im.width*j)+2]*0.1);
			im.pixels[4*(i+im.width*j)]=ic; im.pixels[4*(i+im.width*j)+1]=ic; im.pixels[4*(i+im.width*j)+2]=ic;
		}
		im.updatePixels();
		img=im;

		document.getElementById("introduction").style.display="none";
		document.getElementById("part1").style.display="none";
		document.getElementById("part2").style.display="block";
		document.getElementById("part3").style.display="block";
	});
}

function writechar(){
		background(255);
		res=[];
		img.loadPixels();
	
		let vmn=999999999,vmx=0;
		for(let y=0;fh*(y+1)<img.height && fh*(y+1)<1280;y++){
			for(let x=0;fw*(x+1)<img.width && fw*(x+1)<1280;x++){
				let va=0,mn=99999999;
				for(let i=int(fw*x);i<fw*(x+1);i++) for(let j=int(fh*y);j<fh*(y+1);j++) va+=255-(img.pixels[4*(i+j*img.width)]);
				if(va<vmn) vmn=va; if(va>vmx) vmx=va;
			}
		}
		vmn*=0.8; vmx*=1.2;
	
		for(let y=0;fh*(y+1)<img.height;y++){
			res.push("");
			for(let x=0;fw*(x+1)<img.width;x++){
				let va=0,mn=99999999;
				let ci="-";
				for(let i=int(fw*x);i<fw*(x+1);i++) for(let j=int(fh*y);j<fh*(y+1);j++) va+=255-(img.pixels[4*(i+j*img.width)]);
				va=map(va,vmn,vmx,fmn,fmx);
				for(let i=0;i<95;i++) if(abs(val[i]-va)<mn){ mn=abs(val[i]-va); ci=textarr[i];}
				res[y]+=ci;
				fill(0);
			}
			text(res[y],0,fh*y+textAscent());
		}
		img.updatePixels();
	
		document.getElementById("part2").style.display="none";
		document.getElementById("part3").style.display="none";
		document.getElementById("loading").style.display="none";
		document.getElementById("part4").style.display="block";
}

function showError(str){
	document.getElementById("font-example").style.fontSize="12px";
	document.getElementById("font-example").style.color="red";
	document.getElementById("font-example").innerText=str;
}

function showExample(){
	if(+document.getElementById("font-size").value<4 || +document.getElementById("font-size").value>12){
		showError("Font size should be between 4 and 12!");
		return;
	}
	document.getElementById("font-example").innerText="This is how your font will look like"
	document.getElementById("font-example").style.color="white";
	document.getElementById("font-example").style.fontSize=document.getElementById("font-size").value+"px";
	document.getElementById("font-example").style.fontFamily="Consolas,monaco,monospace";
	fs=+document.getElementById("font-size").value;
	//fnt
}

function saveres(){
	let ires=res,cre=" Created on napatsc.com/ascii-art ",crr=int(res[0].length/cre.length),crm=res[0].length%cre.length;
	ires.push("#".repeat(int(crm/2))+cre.repeat(crr)+"#".repeat(int((crm+1)/2)));
	ires.unshift("Paste this text in Microsoft Word. Change font family to Consolas Bold and font size "+fs+" with line spacing exactly "+fs+" pt for the best result. If the text does not resemble the image, the page size might be too small.");
	saveStrings(ires,imgname);
}