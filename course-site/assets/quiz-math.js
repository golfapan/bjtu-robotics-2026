/* Pure geometry used by the classroom view; lengths are metres unless labelled. */
(() => {
  const rad = d => d * Math.PI / 180;
  const add = (a,b) => a.map((v,i)=>v+b[i]);
  const scale = (a,s) => a.map(v=>v*s);
  const mul = (A,v) => A.map(row=>row.reduce((s,x,i)=>s+x*v[i],0));
  // Fixed-axis roll, pitch, yaw: Rz(yaw) Ry(pitch) Rx(roll).
  function rpy(roll,pitch,yaw) {
    const [a,b,c]=[roll,pitch,yaw].map(rad), cr=Math.cos(a),sr=Math.sin(a),cp=Math.cos(b),sp=Math.sin(b),cy=Math.cos(c),sy=Math.sin(c);
    return [[cy*cp,cy*sp*sr-sy*cr,cy*sp*cr+sy*sr],[sy*cp,sy*sp*sr+cy*cr,sy*sp*cr-cy*sr],[-sp,cp*sr,cp*cr]];
  }
  const col=(R,j)=>R.map(row=>row[j]);
  const pose=(R,p)=>[...R.map((row,i)=>[...row,p[i]]),[0,0,0,1]];
  const flange=(R,p,d)=>add(p,scale(col(R,2),-d));
  const planar=(q1,q2,l1=1.1,l2=.7)=>[l1*Math.cos(q1)+l2*Math.cos(q1+q2),l1*Math.sin(q1)+l2*Math.sin(q1+q2)];
  function rank(A){let M=A.map(r=>r.slice()),r=0;for(let c=0;c<M[0].length&&r<M.length;c++){let k=r;for(let i=r+1;i<M.length;i++)if(Math.abs(M[i][c])>Math.abs(M[k][c]))k=i;if(Math.abs(M[k][c])<1e-9)continue;[M[r],M[k]]=[M[k],M[r]];const pivot=M[r][c];for(let j=c;j<M[0].length;j++)M[r][j]/=pivot;for(let i=0;i<M.length;i++)if(i!==r){const f=M[i][c];for(let j=c;j<M[0].length;j++)M[i][j]-=f*M[r][j];}r++;}return r;}
  function ik2(x,y,l1=1.1,l2=.7,sign=1){let c=(x*x+y*y-l1*l1-l2*l2)/(2*l1*l2);if(Math.abs(c)>1+1e-9)return null;c=Math.max(-1,Math.min(1,c));let q2=sign*Math.acos(c),q1=Math.atan2(y,x)-Math.atan2(l2*Math.sin(q2),l1+l2*Math.cos(q2));return[q1,q2];}
  function segmentDistance(p,a,b){const d=b.map((x,i)=>x-a[i]),w=p.map((x,i)=>x-a[i]);const n=d.reduce((s,x)=>s+x*x,0);const t=n?Math.max(0,Math.min(1,w.reduce((s,x,i)=>s+x*d[i],0)/n)):0;return Math.hypot(...p.map((x,i)=>x-a[i]-t*d[i]));}
  const api={rad,add,scale,mul,rpy,col,pose,flange,planar,rank,ik2,segmentDistance};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.BJTUQuizMath=api;
})();
