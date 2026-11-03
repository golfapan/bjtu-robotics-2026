/* Test 0 reference calculations. Rotations are active; lengths are metres. */
(()=>{'use strict';
 const mul=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,x,k)=>s+x*B[k][j],0)));
 const rot=(axis,degrees)=>{const t=degrees*Math.PI/180,c=Math.cos(t),s=Math.sin(t);return axis==='x'?[[1,0,0],[0,c,-s],[0,s,c]]:axis==='y'?[[c,0,s],[0,1,0],[-s,0,c]]:[[c,-s,0],[s,c,0],[0,0,1]];};
 function stages(mode){let R=[[1,0,0],[0,1,0],[0,0,1]];const out=[R];for(const [axis,a]of [['z',90],['y',-90],['x',90]]){R=mode===0?mul(rot(axis,a),R):mul(R,rot(axis,a));out.push(R);}return out;}
 function jacobian(q1,q2,q3,d4){const a=q1*Math.PI/180,b=q2*Math.PI/180,c1=Math.cos(a),s1=Math.sin(a),c2=Math.cos(b),s2=Math.sin(b),r=d4*c2+q3*s2,t=d4*s2-q3*c2;
 return [[s1*r,c1*t,-c1*s2,0],[-c1*r,s1*t,-s1*s2,0],[0,r,-c2,0],[0,-s1,0,-c1*c2],[0,c1,0,-s1*c2],[1,0,0,s2]];}
 function position(q1,q2,q3,d4){const a=q1*Math.PI/180,b=q2*Math.PI/180,r=d4*Math.cos(b)+q3*Math.sin(b);return [-Math.cos(a)*r,-Math.sin(a)*r,d4*Math.sin(b)-q3*Math.cos(b)];}
 // One compatible TCP orientation: tool Z coincides with joint 4's axis.
 // Its zero-angle X/Y convention is chosen for the illustration, not a claimed robot model.
 function orientation(q1,q2,q4=0){const a=q1*Math.PI/180,b=q2*Math.PI/180,c1=Math.cos(a),s1=Math.sin(a),c2=Math.cos(b),s2=Math.sin(b);const R0=[[-c1*s2,s1,-c1*c2],[-s1*s2,-c1,-s1*c2],[-c2,0,s2]];return mul(R0,rot('z',q4));}
 function pose(q1,q2,q3,q4,d4){const R=orientation(q1,q2,q4),p=position(q1,q2,q3,d4);return [...R.map((row,i)=>[...row,p[i]]),[0,0,0,1]];}
 const api={mul,rot,stages,jacobian,position,orientation,pose};if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.BJTUQuizTest0=api;
})();
