(function(e){var l=e.Vector3DUtil;var j=e.JConfig;var k=e.CollPointInfo;var f=e.CollisionSystemBrute;var m=e.CollisionSystemGrid;var i=e.ContactData;var g=e.JMatrix3D;var b=e.JNumber3D;var d=e.BodyPair;var a=e.CachedImpulse;var c=e.JCollisionEvent;var h=function(){this.setSolverType(j.solverType);this._doingIntegration=false;this._bodies=[];this._collisions=[];this._effects=[];this._activeBodies=[];this._constraints=[];this._controllers=[];this._cachedContacts=[];this._collisionSystem=new f();this.setGravity(b.getScaleVector(l.Y_AXIS,-10));};h.prototype._currentPhysicsSystem=null;h.prototype._maxVelMag=0.5;h.prototype._minVelForProcessing=0.001;h.prototype._bodies=null;h.prototype._activeBodies=null;h.prototype._collisions=null;h.prototype._constraints=null;h.prototype._controllers=null;h.prototype._effects=null;h.prototype._gravityAxis=null;h.prototype._gravity=null;h.prototype._doingIntegration=null;h.prototype.preProcessCollisionFn=function(){};h.prototype.preProcessContactFn=function(){};h.prototype.processCollisionFn=function(){};h.prototype.processContactFn=function(){};h.prototype._cachedContacts=null;h.prototype._collisionSystem=null;h.getInstance=function(){if(!h._currentPhysicsSystem){h._currentPhysicsSystem=new h();}return h._currentPhysicsSystem;};h.prototype.getAllExternalForces=function(p){for(var o=0,q=this._bodies.length;o<q;o++){this._bodies[o].addExternalForces(p);}for(var o=0,n=this._controllers.length;o<n;o++){this._controllers[o].updateController(p);}};h.prototype.setCollisionSystem=function(q,t,s,r,p,o,n,w,v,u){if(t==undefined){t=0;}if(s==undefined){s=0;}if(r==undefined){r=0;}if(p==undefined){p=20;}if(o==undefined){o=20;}if(n==undefined){n=20;}if(w==undefined){w=200;}if(v==undefined){v=200;}if(u==undefined){u=200;}if(q){this._collisionSystem=new m(t,s,r,p,o,n,w,v,u);}else{this._collisionSystem=new f();}};h.prototype.getCollisionSystem=function(){return this._collisionSystem;};h.prototype.setGravity=function(n){this._gravity=n;if(this._gravity[0]==this._gravity[1]&&this._gravity[1]==this._gravity[2]){this._gravityAxis=-1;}this._gravityAxis=0;if(Math.abs(this._gravity[1])>Math.abs(this._gravity[2])){this._gravityAxis=1;}if(Math.abs(this._gravity[2])>Math.abs(this._gravity[this._gravityAxis])){this._gravityAxis=2;}};h.prototype.get_gravity=function(){return this._gravity;};h.prototype.get_gravityAxis=function(){return this._gravityAxis;};h.prototype.get_bodies=function(){return this._bodies;};h.prototype.addBody=function(n){if(!this.findBody(n)){this._bodies.push(n);this._collisionSystem.addCollisionBody(n);}};h.prototype.removeBody=function(n){if(this.findBody(n)){this._bodies.splice(this._bodies.indexOf(n),1);this._collisionSystem.removeCollisionBody(n);}};h.prototype.removeAllBodies=function(){this._bodies=[];this._collisionSystem.removeAllCollisionBodies();};h.prototype.addConstraint=function(n){if(!this.findConstraint(n)){this._constraints.push(n);}};h.prototype.removeConstraint=function(n){if(this.findConstraint(n)){this._constraints.splice(this._constraints.indexOf(n),1);}};h.prototype.removeAllConstraints=function(){this._constraints=[];};h.prototype.addEffect=function(n){if(!this.findEffect(n)){this._effects.push(n);}};h.prototype.removeEffect=function(n){if(this.findEffect(n)){this._effects.splice(this._effects.indexOf(n),1);}};h.prototype.removeAllEffects=function(){this._effects=[];};h.prototype.addController=function(n){if(!this.findController(n)){this._controllers.push(n);}};h.prototype.removeController=function(n){if(this.findController(n)){this._controllers.splice(this._controllers.indexOf(n),1);}};h.prototype.removeAllControllers=function(){this._controllers=[];};h.prototype.setSolverType=function(n){switch(n){case"FAST":this.preProcessCollisionFn=this.preProcessCollisionFast;this.preProcessContactFn=this.preProcessCollisionFast;this.processCollisionFn=this.processCollision;this.processContactFn=this.processCollision;return;case"NORMAL":this.preProcessCollisionFn=this.preProcessCollisionNormal;this.preProcessContactFn=this.preProcessCollisionNormal;this.processCollisionFn=this.processCollision;this.processContactFn=this.processCollision;return;case"ACCUMULATED":this.preProcessCollisionFn=this.preProcessCollisionAccumulated;this.preProcessContactFn=this.preProcessCollisionAccumulated;this.processCollisionFn=this.processCollision;this.processContactFn=this.processCollisionAccumulated;return;default:this.preProcessCollisionFn=this.preProcessCollisionNormal;this.preProcessContactFn=this.preProcessCollisionNormal;this.processCollisionFn=this.processCollision;this.processContactFn=this.processCollision;return;}};h.prototype.findBody=function(n){return(this._bodies.indexOf(n)>-1);};h.prototype.findConstraint=function(o){var n=this._constraints.length-1;if(n>0){do{if(o==this._constraints[n]){return true;}}while(n--);}return false;};h.prototype.findEffect=function(o){var n=this._effects.length-1;if(n>0){do{if(o==this._effects[n]){return true;}}while(n--);}return false;};h.prototype.findController=function(n){var o=this._controllers.length-1;if(o>0){do{if(n==this._controllers[o]){return true;}}while(o--);}return false;};h.prototype.preProcessCollisionFast=function(z,p){z.satisfied=false;var o=z.objInfo.body0;var n=z.objInfo.body1;var u=z.dirToBody;var B=j.numPenetrationRelaxationTimesteps*p;var y=0;var A;var s;var r=z.pointInfo.length;var t=b.NUM_TINY;if(r>1){var x=[0,0,0,0];var v=[0,0,0,0];var D=0;for(var q=0;q<r;q++){A=z.pointInfo[q];x=l.add(x,A.r0);v=l.add(v,A.r1);D+=A.initialPenetration;}x=b.getDivideVector(x,r);v=b.getDivideVector(v,r);D/=r;var C=new k();C.r0=x;C.r1=v;C.initialPenetration=D;z.pointInfo=[C];}A=z.pointInfo[0];if(!o.get_movable()){A.denominator=0;}else{s=l.crossProduct(A.r0,u);g.multiplyVector(o.get_worldInvInertia(),s);A.denominator=o.get_invMass()+l.dotProduct(u,l.crossProduct(s,A.r0));}if(n.get_movable()){s=l.crossProduct(A.r1,u);g.multiplyVector(n.get_worldInvInertia(),s);A.denominator+=(n.get_invMass()+l.dotProduct(u,l.crossProduct(s,A.r1)));}if(A.denominator<t){A.denominator=t;}if(A.initialPenetration>j.allowedPenetration){A.minSeparationVel=(A.initialPenetration-j.allowedPenetration)/B;}else{y=-0.1*(A.initialPenetration-j.allowedPenetration)/j.allowedPenetration;if(y<t){y=t;}else{if(y>1){y=1;}}var w=(p>t)?p:t;A.minSeparationVel=y*(A.initialPenetration-j.allowedPenetration)/w;}if(A.minSeparationVel>this._maxVelMag){A.minSeparationVel=this._maxVelMag;}};h.prototype.preProcessCollisionNormal=function(w,p){w.satisfied=false;var o=w.objInfo.body0;var n=w.objInfo.body1;var t=w.dirToBody;var y=j.numPenetrationRelaxationTimesteps*p;var v=0;var x;var s;var r=w.pointInfo.length;for(var q=0;q<r;q++){x=w.pointInfo[q];if(!o.get_movable()){x.denominator=0;}else{s=l.crossProduct(x.r0,t);g.multiplyVector(o.get_worldInvInertia(),s);x.denominator=o.get_invMass()+l.dotProduct(t,l.crossProduct(s,x.r0));}if(n.get_movable()){s=l.crossProduct(x.r1,t);g.multiplyVector(n.get_worldInvInertia(),s);x.denominator+=(n.get_invMass()+l.dotProduct(t,l.crossProduct(s,x.r1)));}if(x.denominator<b.NUM_TINY){x.denominator=b.NUM_TINY;}if(x.initialPenetration>j.allowedPenetration){x.minSeparationVel=(x.initialPenetration-j.allowedPenetration)/y;}else{v=-0.1*(x.initialPenetration-j.allowedPenetration)/j.allowedPenetration;if(v<b.NUM_TINY){v=b.NUM_TINY;}else{if(v>1){v=1;}}var u=(p>b.NUM_TINY)?p:b.NUM_TINY;x.minSeparationVel=v*(x.initialPenetration-j.allowedPenetration)/u;}if(x.minSeparationVel>this._maxVelMag){x.minSeparationVel=this._maxVelMag;}}};h.prototype.preProcessCollisionAccumulated=function(s,A){s.satisfied=false;var z=s.objInfo.body0;var x=s.objInfo.body1;var t=s.dirToBody;var y=j.numPenetrationRelaxationTimesteps*A;var r;var v;var J;var G=0;var H=b.NUM_TINY;var w=j.allowedPenetration;var F=s.pointInfo.length;for(var E=0;E<F;E++){v=s.pointInfo[E];J=v.initialPenetration-w;if(!z.get_movable()){v.denominator=0;}else{r=l.crossProduct(v.r0,t);g.multiplyVector(z.get_worldInvInertia(),r);v.denominator=z.get_invMass()+l.dotProduct(t,l.crossProduct(r,v.r0));}if(x.get_movable()){r=l.crossProduct(v.r1,t);g.multiplyVector(x.get_worldInvInertia(),r);v.denominator+=(x.get_invMass()+l.dotProduct(t,l.crossProduct(r,v.r1)));}if(v.denominator<H){v.denominator=H;}if(v.initialPenetration>w){v.minSeparationVel=J/y;}else{G=-0.1*J/w;if(G<H){G=H;}else{if(G>1){G=1;}}var D=(A>H)?A:H;v.minSeparationVel=G*J/D;}v.accumulatedNormalImpulse=0;v.accumulatedNormalImpulseAux=0;v.accumulatedFrictionImpulse=[0,0,0,0];var q=0.04;var I=new d(z,x,[0,0,0,0],[0,0,0,0]);for(var C=0,p=this._cachedContacts.length;C<p;C++){var n=this._cachedContacts[C];var B=n.pair;if(I.body0!=B.body0||I.body1==B.body1){continue;}var o=(B.body0==z)?l.get_lengthSquared(l.subtract(B.r,v.r0)):l.get_lengthSquared(l.subtract(B.r,v.r1));if(o<q){q=o;v.accumulatedNormalImpulse=this._cachedContacts[C].impulse.normalImpulse;v.accumulatedNormalImpulseAux=this._cachedContacts[C].impulse.normalImpulseAux;v.accumulatedFrictionImpulse=this._cachedContacts[C].impulse.frictionImpulse;if(this._cachedContacts[C].pair.body0!=z){v.accumulatedFrictionImpulse=b.getScaleVector(v.accumulatedFrictionImpulse,-1);}}}var u;if(v.accumulatedNormalImpulse!=0){u=b.getScaleVector(t,v.accumulatedNormalImpulse);u=l.add(u,v.accumulatedFrictionImpulse);z.applyBodyWorldImpulse(u,v.r0);x.applyBodyWorldImpulse(b.getScaleVector(u,-1),v.r1);}if(v.accumulatedNormalImpulseAux!=0){u=b.getScaleVector(t,v.accumulatedNormalImpulseAux);z.applyBodyWorldImpulseAux(u,v.r0);x.applyBodyWorldImpulseAux(b.getScaleVector(u,-1),v.r1);}}};h.prototype.processCollision=function(t,G){t.satisfied=true;var D=t.objInfo.body0;var C=t.objInfo.body1;var x=false;var v=t.dirToBody;var J=0;var K=0;var p=0;var F=0;var z;var w;var u;var A;var B=[0,0,0,0];var I=t.pointInfo.length;for(var H=0;H<I;H++){A=t.pointInfo[H];w=D.getVelocity(A.r0);u=C.getVelocity(A.r1);K=l.dotProduct(l.subtract(w,u),v);if(K>A.minSeparationVel){continue;}p=-1*t.mat.get_restitution()*K;if(p<this._minVelForProcessing){p=A.minSeparationVel;}J=p-K;if(J<=this._minVelForProcessing){continue;}F=J/A.denominator;x=true;z=b.getScaleVector(v,F);B=l.add(B,z);D.applyBodyWorldImpulse(z,A.r0);C.applyBodyWorldImpulse(b.getScaleVector(z,-1),A.r1);w=D.getVelocity(A.r0);u=C.getVelocity(A.r1);var r;var E=w.slice(0);if(C.get_movable()){E=l.subtract(w,u);}var s=l.subtract(E,b.getScaleVector(v,l.dotProduct(E,v)));var y=l.get_length(s);if(y>this._minVelForProcessing){var q=b.getDivideVector(s,-y);var n=0;if(D.get_movable()){r=l.crossProduct(A.r0,q);g.multiplyVector(D.get_worldInvInertia(),r);n=D.get_invMass()+l.dotProduct(q,l.crossProduct(r,A.r0));}if(C.get_movable()){r=l.crossProduct(A.r1,q);g.multiplyVector(C.get_worldInvInertia(),r);n+=(C.get_invMass()+l.dotProduct(q,l.crossProduct(r,A.r1)));}if(n>b.NUM_TINY){var o=y/n;q=b.getScaleVector(q,o);D.applyBodyWorldImpulse(q,A.r0);C.applyBodyWorldImpulse(b.getScaleVector(q,-1),A.r1);}}}if(x){D.setConstraintsAndCollisionsUnsatisfied();C.setConstraintsAndCollisionsUnsatisfied();if(l.get_length(B)>0){D.dispatchEvent(new c(C,B));C.dispatchEvent(new c(D,b.getScaleVector(B,-1)));}}return x;};h.prototype.processCollisionAccumulated=function(t,L){t.satisfied=true;var y=false;var w=t.dirToBody;var I=t.objInfo.body0;var H=t.objInfo.body1;var R=0;var U=0;var K=0;var B;var x;var v;var C;var D=[0,0,0,0];var Q=t.pointInfo.length;for(var O=0;O<Q;O++){C=t.pointInfo[O];x=I.getVelocity(C.r0);v=H.getVelocity(C.r1);U=l.dotProduct(l.subtract(x,v),w);R=-U;if(C.minSeparationVel<0){R+=C.minSeparationVel;}if(Math.abs(R)>this._minVelForProcessing){K=R/C.denominator;var F=C.accumulatedNormalImpulse;var M=(F+K);if(M<0){M=0;}C.accumulatedNormalImpulse=M;var u=M-F;B=b.getScaleVector(w,u);D=l.add(D,B);I.applyBodyWorldImpulse(B,C.r0);H.applyBodyWorldImpulse(b.getScaleVector(B,-1),C.r1);y=true;}x=I.getVelocityAux(C.r0);v=H.getVelocityAux(C.r1);U=l.dotProduct(l.subtract(x,v),w);R=-U;if(C.minSeparationVel>0){R+=C.minSeparationVel;}if(Math.abs(R)>this._minVelForProcessing){K=R/C.denominator;F=C.accumulatedNormalImpulseAux;var G=C.accumulatedNormalImpulseAux+K;if(G<0){G=0;}C.accumulatedNormalImpulseAux=G;u=G-F;B=b.getScaleVector(w,u);I.applyBodyWorldImpulseAux(B,C.r0);H.applyBodyWorldImpulseAux(b.getScaleVector(B,-1),C.r1);y=true;}if(C.accumulatedNormalImpulse>0){x=I.getVelocity(C.r0);v=H.getVelocity(C.r1);var r;var J=l.subtract(x,v);var s=l.subtract(J,b.getScaleVector(w,l.dotProduct(J,w)));var A=l.get_length(s);if(A>this._minVelForProcessing){var q=b.getScaleVector(b.getDivideVector(s,A),-1);var o=0;if(I.get_movable()){r=l.crossProduct(C.r0,q);g.multiplyVector(I.get_worldInvInertia(),r);o=I.invMass+l.dotProduct(q,l.crossProduct(r,C.r0));}if(H.get_movable()){r=l.crossProduct(C.r1,q);g.multiplyVector(H.get_worldInvInertia(),r);o+=(H.invMass+l.dotProduct(q,l.crossProduct(r,C.r1)));}if(o>b.NUM_TINY){var p=A/o;var n=b.getScaleVector(q,p);var S=C.accumulatedFrictionImpulse.slice(0);C.accumulatedFrictionImpulse=l.add(C.accumulatedFrictionImpulse,n);var P=l.get_length(C.accumulatedFrictionImpulse);var E=t.mat.friction*C.accumulatedNormalImpulse;if(P>b.NUM_TINY&&P>E){C.accumulatedFrictionImpulse=b.getScaleVector(C.accumulatedFrictionImpulse,E/P);}var z=l.subtract(C.accumulatedFrictionImpulse,S);I.applyBodyWorldImpulse(z,C.r0);H.applyBodyWorldImpulse(b.getScaleVector(z,-1),C.r1);}}}}if(y){I.setConstraintsAndCollisionsUnsatisfied();H.setConstraintsAndCollisionsUnsatisfied();if(l.get_length(D)>0){I.dispatchEvent(new c(H,D));H.dispatchEvent(new c(I,b.getScaleVector(D,-1)));}}return y;};h.prototype.sortPositionX=function(o,n){if(o.get_currentState().position[0]<n.get_currentState().position[0]){return -1;}else{if(o.get_currentState().position[0]>n.get_currentState().position[0]){return 1;}else{return 0;}}};h.prototype.sortPositionY=function(o,n){if(o.get_currentState().position[1]<n.get_currentState().position[1]){return -1;}else{if(o.get_currentState().position[1]>n.get_currentState().position[1]){return 1;}else{return 0;}}};h.prototype.sortPositionZ=function(o,n){if(o.get_currentState().position[2]<n.get_currentState().position[2]){return -1;}else{if(o.get_currentState().position[2]>n.get_currentState().position[2]){return 1;}else{return 0;}}};h.prototype.doShockStep=function(q){if(Math.abs(this._gravity[0])>Math.abs(this._gravity[1])&&Math.abs(this._gravity[0])>Math.abs(this._gravity[2])){this._bodies=this._bodies.sort(this.sortPositionX);this._collisionSystem.collBody=this._collisionSystem.collBody.sort(this.sortPositionX);}else{if(Math.abs(this._gravity[1])>Math.abs(this._gravity[2])&&Math.abs(this._gravity[1])>Math.abs(this._gravity[0])){this._bodies=this._bodies.sort(this.sortPositionY);this._collisionSystem.collBody=this._collisionSystem.collBody.sort(this.sortPositionY);}else{if(Math.abs(this._gravity[2])>Math.abs(this._gravity[0])&&Math.abs(this._gravity[2])>Math.abs(this._gravity[1])){this._bodies=this._bodies.sort(this.sortPositionZ);this._collisionSystem.collBody=this._collisionSystem.collBody.sort(this.sortPositionZ);}}}var r;var n;var s=true;var t=[];var p;var o;while(s){s=false;for(var v=0;v<this._bodies.length;v++){var w=this._bodies[v];if(w.get_movable()&&w.get_doShockProcessing()){if(w.collisions.length==0||!w.isActive){w.internalSetImmovable();}else{n=false;t=w.collisions;for(var u=0;u<t.length;u++){r=t[u];p=r.objInfo.body0;o=r.objInfo.body1;if((p==w&&!o.get_movable())||(o==w&&!p.get_movable())){this.preProcessCollisionFast(r,q);this.processCollision(r,q);n=true;}}if(n){w.internalSetImmovable();s=true;}}}}}for(var v=0;v<this._bodies.length;v++){w=this._bodies[v];w.internalRestoreImmovable();t=w.collisions;for(var u=0;u<t.length;u++){r=t[u];this.preProcessCollisionFn(r,q);this.processCollisionFn(r,q);}}};h.prototype.updateContactCache=function(){this._cachedContacts=[];var s;var u;var n;for(var q=0,o=this._collisions.length;q<o;q++){var t=this._collisions[q];for(var p=0,r=t.pointInfo.length;p<r;p++){s=t.pointInfo[p];u=(t.objInfo.body0.id>t.objInfo.body1.id)?s.accumulatedFrictionImpulse:b.getScaleVector(s.accumulatedFrictionImpulse,-1);n=new i();
n.pair=new d(t.objInfo.body0,t.objInfo.body1,s.r0,s.r1);n.impulse=new a(s.accumulatedNormalImpulse,s.accumulatedNormalImpulseAux,s.accumulatedFrictionImpulse);this._cachedContacts.push(n);}}};h.prototype.handleAllConstraints=function(n,w,y){var z=this._collisions.length;var v;var r;for(var s=0,x=this._constraints.length;s<x;s++){this._constraints[s].preApply(n);}if(y){for(var s=0,x=this._collisions.length;s<x;s++){this.preProcessContactFn(this._collisions[s],n);this._collisions[s].mat.set_restitution(0);this._collisions[s].satisfied=false;}}else{for(var s=0,x=this._collisions.length;s<x;s++){this.preProcessCollisionFn(this._collisions[s],n);}}var u;var p;var t;for(var o=0;o<w;o++){p=false;for(var s=0,x=this._collisions.length;s<x;s++){v=this._collisions[s];if(!v.satisfied){if(y){u=this.processContactFn(v,n);p=p||u;}else{u=this.processCollisionFn(v,n);p=p||u;}}}for(var s=0,x=this._constraints.length;s<x;s++){var r=this._constraints[s];if(!r.get_satisfied()){u=r.apply(n);p=p||u;}}this.tryToActivateAllFrozenObjects();if(y){t=this._collisions.length;for(var q=z;q<t;q++){this._collisions[q].mat.set_restitution(0);this._collisions[q].satisfied=false;this.preProcessContactFn(this._collisions[q],n);}}else{t=this._collisions.length;for(q=z;q<t;q++){this.preProcessCollisionFn(this._collisions[q],n);}}z=this._collisions.length;if(!p){break;}}};h.prototype.handleAllEffects=function(){var o;var n=this._effects.length-1;if(n<0){return;}do{o=this._effects[n];if(o.enabled){o.Apply();}}while(n--);};h.prototype.activateObject=function(p){if(!p.get_movable()||p.isActive){return;}p.setActive();this._activeBodies.push(p);var r=this._collisions.length;this._collisionSystem.detectCollisions(p,this._collisions);var o;var s;for(var q=r,n=this._collisions.length;q<n;q++){o=this._collisions[q].objInfo.body0;s=this._collisions[q].dirToBody;if(o==p){o=this._collisions[q].objInfo.body1;s=b.getScaleVector(this._collisions[q].dirToBody,-1);}if(!o.isActive&&l.dotProduct(o.get_force(),s)<-b.NUM_TINY){this.activateObject(o);}}};h.prototype.dampAllActiveBodies=function(){for(var n=0,o=this._activeBodies.length;n<o;n++){_activeBody=this._activeBodies[n];_activeBody.dampForDeactivation();}};h.prototype.tryToActivateAllFrozenObjects=function(){for(var n=0,p=this._bodies.length;n<p;n++){var o=this._bodies[n];if(!o.isActive){if(o.getShouldBeActive()){this.activateObject(o);}else{if(o.getVelChanged()){o.setVelocity([0,0,0,0]);o.setAngVel([0,0,0,0]);o.clearVelChanged();}}}}};h.prototype.activateAllFrozenObjectsLeftHanging=function(){var n;for(var p=0,s=this._bodies.length;p<s;p++){var r=this._bodies[p];if(r.isActive){r.doMovementActivations();if(r.collisions.length>0){for(var o=0,q=r.collisions.length;o<q;o++){n=r.collisions[o].objInfo.body0;if(n==r){n=r.collisions[o].objInfo.body1;}if(!n.isActive){r.addMovementActivation(r.get_currentState().position,n);}}}}}};h.prototype.updateAllVelocities=function(o){for(var n=0,p=this._activeBodies.length;n<p;n++){_activeBody=this._activeBodies[n];_activeBody.updateVelocity(o);}};h.prototype.updateAllPositions=function(o){for(var n=0,p=this._activeBodies.length;n<p;n++){_activeBody=this._activeBodies[n];_activeBody.updatePositionWithAux(o);}};h.prototype.notifyAllPostPhysics=function(o){for(var n=0,p=this._bodies.length;n<p;n++){_body=this._bodies[n];_body.postPhysics(o);}};h.prototype.updateAllObject3D=function(){for(var n=0,o=this._bodies.length;n<o;n++){_body=this._bodies[n];_body.updateObject3D();}};h.prototype.limitAllVelocities=function(){for(var n=0,o=this._activeBodies.length;n<o;n++){_activeBody=this._activeBodies[n];_activeBody.limitVel();_activeBody.limitAngVel();}};h.prototype.tryToFreezeAllObjects=function(o){for(var n=0,p=this._activeBodies.length;n<p;n++){_activeBody=this._activeBodies[n];_activeBody.tryToFreeze(o);}};h.prototype.detectAllCollisions=function(o){for(var n=0,p=this._activeBodies.length;n<p;n++){_activeBody=this._activeBodies[n];_activeBody.storeState();}this.updateAllVelocities(o);this.updateAllPositions(o);for(var n=0,q=this._bodies.length;n<q;n++){_body=this._bodies[n];_body.collisions=[];}this._collisions=[];this._collisionSystem.detectAllCollisions(this._activeBodies,this._collisions);for(var n=0,p=this._activeBodies.length;n<p;n++){_activeBody=this._activeBodies[n];_activeBody.restoreState();}};h.prototype.copyAllCurrentStatesToOld=function(){for(var n=0,o=this._bodies.length;n<o;n++){_body=this._bodies[n];if(_body.isActive||_body.getVelChanged()){_body.copyCurrentStateToOld();}}};h.prototype.findAllActiveBodies=function(){this._activeBodies=[];for(var n=0,p=this._bodies.length;n<p;n++){var o=this._bodies[n];if(o.isActive){this._activeBodies.push(o);}}};h.prototype.integrate=function(o){this._doingIntegration=true;this.findAllActiveBodies();this.copyAllCurrentStatesToOld();this.getAllExternalForces(o);this.handleAllEffects();this.detectAllCollisions(o);this.handleAllConstraints(o,j.numCollisionIterations,false);this.updateAllVelocities(o);this.handleAllConstraints(o,j.numContactIterations,true);if(j.doShockStep){this.doShockStep(o);}this.dampAllActiveBodies();this.tryToFreezeAllObjects(o);this.activateAllFrozenObjectsLeftHanging();this.limitAllVelocities();this.updateAllPositions(o);this.notifyAllPostPhysics(o);this.updateAllObject3D();if(j.solverType=="ACCUMULATED"){this.updateContactCache();}for(var n=0,p=this._bodies.length;n<p;n++){_body=this._bodies[n];_body.clearForces();}this._doingIntegration=false;};e.PhysicsSystem=h;})(jigLib);