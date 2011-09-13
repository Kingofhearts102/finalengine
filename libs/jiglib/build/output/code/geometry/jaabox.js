(function(a){var f=a.Vector3DUtil;var c=a.JNumber3D;var e=a.EdgeData;var d=a.JMath3D;var b=function(h,g){if(h){this._minPos=h.slice(0);this._maxPos=g.slice(0);}else{this._minPos=[0,0,0];this._maxPos=[0,0,0];}};b.prototype._minPos=null;b.prototype._maxPos=null;b.prototype.get_minPos=function(){return this._minPos;};b.prototype.set_minPos=function(g){this._minPos=g.slice(0);};b.prototype.get_maxPos=function(){return this._maxPos;};b.prototype.set_maxPos=function(g){this._maxPos=g.slice(0);};b.prototype.get_sideLengths=function(){var g=this._maxPos.slice(0);f.subtract(g,this._minPos);return g;};b.prototype.get_centrePos=function(){var g=this._minPos.slice(0);return c.getScaleVector(f.add(g,this._maxPos),0.5);};b.prototype.getAllPoints=function(){var g,h;var i;g=this.get_centrePos();h=this.get_sideLengths().slice(0);f.scaleBy(h,0.5);i=[];i[0]=f.add(g,[h[0],-h[1],h[2]]);i[1]=f.add(g,[h[0],h[1],h[2]]);i[2]=f.add(g,[-h[0],-h[1],h[2]]);i[3]=f.add(g,[-h[0],h[1],h[2]]);i[4]=f.add(g,[-h[0],-h[1],-h[2]]);i[5]=f.add(g,[-h[0],h[1],-h[2]]);i[6]=f.add(g,[h[0],-h[1],-h[2]]);i[7]=f.add(g,[h[0],h[1],-h[2]]);return i;};b.prototype.get_edges=function(){return[new e(0,1),new e(0,2),new e(0,6),new e(2,3),new e(2,4),new e(6,7),new e(6,4),new e(1,3),new e(1,7),new e(3,5),new e(7,5),new e(4,5)];};b.prototype.move=function(g){f.add(this._minPos,g);f.add(this._maxPos,g);};b.prototype.clear=function(){this._minPos=f.create(c.NUM_HUGE,c.NUM_HUGE,c.NUM_HUGE,0);this._maxPos=f.create(-c.NUM_HUGE,-c.NUM_HUGE,-c.NUM_HUGE,0);};b.prototype.clone=function(){return new b(this._minPos,this._maxPos);};b.prototype.addPoint=function(i){var h=this._minPos;var g=this._maxPos;if(i[0]<h[0]){h[0]=i[0]-c.NUM_TINY;}if(i[0]>g[0]){g[0]=i[0]+c.NUM_TINY;}if(i[1]<h[1]){h[1]=i[1]-c.NUM_TINY;}if(i[1]>g[1]){g[1]=i[1]+c.NUM_TINY;}if(i[2]<h[2]){h[2]=i[2]-c.NUM_TINY;}if(i[2]>g[2]){g[2]=i[2]+c.NUM_TINY;}};b.prototype.addBox=function(g){var h=g.getCornerPoints(g.get_currentState());this.addPoint(h[0]);this.addPoint(h[1]);this.addPoint(h[2]);this.addPoint(h[3]);this.addPoint(h[4]);this.addPoint(h[5]);this.addPoint(h[6]);this.addPoint(h[7]);};b.prototype.addSphere=function(g){var i=this._minPos;var h=this._maxPos;if(g.get_currentState().position[0]-g.get_radius()<i[0]){i[0]=(g.get_currentState().position[0]-g.get_radius())-c.NUM_TINY;}if(g.get_currentState().position[0]+g.get_radius()>h[0]){h[0]=(g.get_currentState().position[0]+g.get_radius())+c.NUM_TINY;}if(g.get_currentState().position[1]-g.get_radius()<i[1]){i[1]=(g.get_currentState().position[1]-g.get_radius())-c.NUM_TINY;}if(g.get_currentState().position[1]+g.get_radius()>h[1]){h[1]=(g.get_currentState().position[1]+g.get_radius())+c.NUM_TINY;}if(g.get_currentState().position[2]-g.get_radius()<i[2]){i[2]=(g.get_currentState().position[2]-g.get_radius())-c.NUM_TINY;}if(g.get_currentState().position[2]+g.get_radius()>h[2]){h[2]=(g.get_currentState().position[2]+g.get_radius())+c.NUM_TINY;}};b.prototype.addCapsule=function(h){var j=h.getBottomPos(h.get_currentState());var i=this._minPos;var g=this._maxPos;if(j[0]-h.get_radius()<i[0]){i[0]=(j[0]-h.get_radius())-c.NUM_TINY;}if(j[0]+h.get_radius()>g[0]){g[0]=(j[0]+h.get_radius())+c.NUM_TINY;}if(j[1]-h.get_radius()<i[1]){i[1]=(j[1]-h.get_radius())-c.NUM_TINY;}if(j[1]+h.get_radius()>g[1]){g[1]=(j[1]+h.get_radius())+c.NUM_TINY;}if(j[2]-h.get_radius()<i[2]){i[2]=(j[2]-h.get_radius())-c.NUM_TINY;}if(j[2]+h.get_radius()>g[2]){g[2]=(j[2]+h.get_radius())+c.NUM_TINY;}j=h.getEndPos(h.get_currentState());if(j[0]-h.get_radius()<i[0]){i[0]=(j[0]-h.get_radius())-c.NUM_TINY;}if(j[0]+h.get_radius()>g[0]){g[0]=(j[0]+h.get_radius())+c.NUM_TINY;}if(j[1]-h.get_radius()<i[1]){i[1]=(j[1]-h.get_radius())-c.NUM_TINY;}if(j[1]+h.get_radius()>g[1]){g[1]=(j[1]+h.get_radius())+c.NUM_TINY;}if(j[2]-h.get_radius()<i[2]){i[2]=(j[2]-h.get_radius())-c.NUM_TINY;}if(j[2]+h.get_radius()>g[2]){g[2]=(j[2]+h.get_radius())+c.NUM_TINY;}};b.prototype.addSegment=function(g){this.addPoint(g.origin);this.addPoint(g.getEnd());};b.prototype.overlapTest=function(i){var h=this._minPos;var g=this._maxPos;return((h[2]>=i.get_maxPos()[2])||(g[2]<=i.get_minPos()[2])||(h[1]>=i.get_maxPos()[1])||(g[1]<=i.get_minPos()[1])||(h[0]>=i.get_maxPos()[0])||(g[0]<=i.get_minPos()[0]))?false:true;};b.prototype.isPointInside=function(i){var h=this._minPos;var g=this._maxPos;return((i[0]>=h[0])&&(i[0]<=g[0])&&(i[1]>=h[1])&&(i[1]<=g[1])&&(i[2]>=h[2])&&(i[2]<=g[2]));};b.prototype.getRadiusAboutCentre=function(){return 0.5*(f.get_length(f.subtract(this._maxPos,this._minPos)));};b.prototype.scaleBox=function(i){var g=this.get_centrePos();var h=f.subtract(this._minPos,g);f.scaleBy(h,i);this._minPos=f.subtract(this._minPos,h);var j=f.subtract(this._maxPos,g);f.scaleBy(j,i);this._maxPos=f.subtract(this._maxPos,j);};b.prototype.toString=function(){var h=this._minPos;var g=this._maxPos;return[h[0],h[1],h[2],g[0],g[1],g[2]].toString();};b.prototype.segmentAABoxOverlap=function(k){var h=0;var w=1;var t=k.origin;var r=k.getEnd();var j=this._minPos;var p=this._maxPos;for(var m=0;m<3;m++){var v=t[m];var n=r[m];var l=p[m];var g=j[m];if(v<n){if(v>l||n<g){return false;}}else{if(n>l||v<g){return false;}}var o=n-v;var u=(v<g)?(g-v)/o:0;var q=(n>l)?(l-v)/o:1;if(u>h){h=u;}if(q<w){w=q;}if(w<h){return false;}}return true;};a.JAABox=b;})(jigLib);