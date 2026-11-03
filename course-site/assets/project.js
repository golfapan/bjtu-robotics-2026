/* Project-led classroom prototype. Original requirements remain in project-source.js. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id),source=window.BJTUProjectSource,M=window.BJTUQuizMath;
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const contentPath='../Content/';
  const lectureFiles=['Introduction','3D Representation','DH Modelling','Inverse Kinematics','Trajectory Planning','ABB RAPID Programming','Jacobian Force and Compliance','Machine Vision and Calibration','Robot Path Planning','Lean Automation'];
  const ppt=n=>contentPath+encodeURIComponent(`Lecture ${String(n).padStart(2,'0')} ${lectureFiles[n-1]}.pdf`);
  const quiz=(n,label)=>({href:`quiz.html#q${n}`,label});
  const product='assets/project-f2.png',workcell='assets/project-f3.png',process='assets/project-f4.png';
  const stages=[
  {
    "tab": "Start · Brief",
    "phase": "CLIENT BRIEF",
    "title": "Understand the assembly brief",
    "visual": "Product and task",
    "image": "assets/project-f2.png",
    "caption": "Figure 1 · product geometry. Starred dimensions are illustrative assumptions.",
    "decision": "Read the task and its boundaries",
    "tasks": [
      "What is assembled? Ten placements: lower panel, four wheels, four spacers and upper panel.",
      "What is supplied? Motors are installed; fastening is excluded. Figure 2 fixes the supply and assembly references.",
      "What does your team design? Robot, base, gripper, grasp points, TCP and feasible motion."
    ],
    "fixed": [
      "Panels: 500 × 260 mm · L3 spacers: 30 mm",
      "Commercial industrial robot: no more than six controlled DOF"
    ],
    "whatif": "A robot can reach every required point. Does this prove it can complete the task with the required tool orientations?",
    "evidence": [
      "Identify the fixed data, design choices and task boundary.",
      "Team arrangements, assessment and final submissions are listed below."
    ],
    "lessons": [
      1,
      10
    ],
    "demos": [
      {
        "href": "quiz.html",
        "label": "Quiz · rotations, DH and Jacobian"
      }
    ],
    "review": "Four engineering stages → EOI, PDR, FDR → final report and demonstration",
    "source": [
      12,
      40
    ],
    "specSection": "§§1–3 · brief and constraints"
  },
  {
    "tab": "Stage 1 · Concept",
    "phase": "STAGE 1 · CONCEPT, WORKCELL AND TASK POSES",
    "title": "Select the robot, base and tool",
    "visual": "Fixed references; team-designed robot base",
    "image": "assets/project-f3.png",
    "caption": "Figure 2 · fixed supply and assembly references; robot base and tool are team choices.",
    "decision": "Questions and tasks",
    "tasks": [
      "What is the assembly order, and where is each part picked and placed?",
      "Where will you grip each part, and from which direction must the tool approach?",
      "Which gripper and actuation suit panels, wheels and spacers? Are tool changes needed?",
      "Which robot structure and DOF can provide the required tool orientations? Use at most six controlled DOF.",
      "What reach is needed for all fixed stations, including approach positions and tool length?",
      "Where should the robot base be placed, and how should it be oriented?",
      "Which commercial model and variant fit? Check payload with tooling, load offset and joint limits.",
      "How will you define world, base, work-object, TCP and representative target frames, including position and orientation?",
      "Which dimensions, masses, contact points and clearances are assumptions? State and justify them."
    ],
    "fixed": [
      "Panel rack X: −750, −370 mm · Y = 0",
      "Spacer table: (500, 0); wheel table: (500, 550) mm",
      "Assembly frame: (−800, 650, 300) mm · yaw 90°",
      "Wheel insertion follows the motor-shaft axis; tool changes are optional."
    ],
    "whatif": "Keep the assembly frame fixed but change the robot base. Which transformation changes, and which physical target stays unchanged?",
    "evidence": [
      "EOI · 5 marks · end of Class 2 / after Lecture 2.",
      "Bring one slide: team/company, assembly/workcell concept, selected robot/model, DOF, payload, reach and suitability."
    ],
    "lessons": [
      1,
      2
    ],
    "demos": [
      {
        "href": "quiz.html#q1",
        "label": "Quiz · fixed and moving axes"
      }
    ],
    "review": "EOI · 5 marks · end of Class 2 / after Lecture 2",
    "source": [
      45,
      50
    ],
    "specSection": "§§3.1–3.2, 4.1 · concept and task definition"
  },
  {
    "tab": "Stage 2 · DH",
    "phase": "STAGE 2 · ROBOT KINEMATIC MODELLING",
    "title": "Model the robot with DH",
    "visual": "The same workcell; now model its robot",
    "image": "assets/project-f3.png",
    "caption": "Figure 2 · fixed supply and assembly references; robot base and tool are team choices.",
    "decision": "Questions and tasks",
    "tasks": [
      "Number the selected robot’s joints. Which consistent DH convention and frame assignment will you use?",
      "Complete the DH table. Which parameter varies at each joint, and which offsets remain fixed?",
      "Derive representative neighbouring-link transforms and the complete base-to-tool arm equation.",
      "Do the frame directions and reference pose match the physical robot? Show the check."
    ],
    "fixed": [
      "Use the actual selected robot geometry",
      "State the convention and fixed joint offsets"
    ],
    "whatif": "The calculated matrix is a valid rigid transform, but its zero pose differs from the robot drawing. Has the model passed validation?",
    "evidence": [
      "PDR · 10 marks · end of Class 3 / after Lecture 3.",
      "Bring 2–3 slides: robot/joint numbering, frames, DH table, one transform and the complete arm equation."
    ],
    "lessons": [
      3,
      2
    ],
    "demos": [
      {
        "href": "quiz.html#q2",
        "label": "Quiz · assign and repair DH frames"
      }
    ],
    "review": "PDR · 10 marks · end of Class 3 / after Lecture 3",
    "source": [
      51,
      56
    ],
    "specSection": "§4.2 · kinematic modelling"
  },
  {
    "tab": "Stage 3 · Validate",
    "phase": "STAGE 3 · KINEMATIC VALIDATION AND MOTION FEASIBILITY",
    "title": "Validate targets and trajectories",
    "visual": "Eight-stage baseline for one placement",
    "image": "assets/project-f2.png",
    "caption": "Figure 1 · product geometry; apply the placement sequence to each of the ten parts.",
    "decision": "Questions and tasks",
    "tasks": [
      "Does the MATLAB/Python robot model agree with your manual DH model?",
      "Define representative pick, approach, place and retreat TCP poses, including orientation and configuration.",
      "Which IK solutions are feasible? Check FK, joint limits, workspace and physical plausibility.",
      "Generate joint and Cartesian trajectories. Check position, velocity, acceleration and required orientation.",
      "If a check fails, what base, tool, grasp, target or motion choice will you revise? Keep Figure 2 stations fixed."
    ],
    "fixed": [
      "Wheel insertion must follow the actual motor-shaft axis",
      "A Puma 560 exercise does not validate a different project robot",
      "Keep the selected robot’s real geometry; use a compatible analytical or numerical IK solver."
    ],
    "whatif": "Both endpoint poses have valid IK solutions, but a straight Cartesian move fails halfway. Which checks are still missing?",
    "evidence": [
      "FDR · 10 marks · end of Class 5 / after Lecture 5.",
      "Bring 2–3 slides: software model, targets/configurations, reachability, joint-limit checks, basic trajectories and one issue or correction."
    ],
    "lessons": [
      4,
      5
    ],
    "demos": [],
    "review": "FDR · 10 marks · end of Class 5 / after Lecture 5",
    "source": [
      57,
      64
    ],
    "workflow": true,
    "specSection": "§4.3 · validation and motion feasibility"
  },
  {
    "tab": "Stage 4 · Integrate",
    "phase": "STAGE 4 · PROGRAMMING AND INTEGRATED DEMONSTRATION",
    "title": "Program and demonstrate the cell",
    "visual": "From targets to a controlled operation",
    "image": "assets/project-f2.png",
    "caption": "Figure 1 · product geometry; apply the placement sequence to each of the ten parts.",
    "decision": "Questions and tasks",
    "tasks": [
      "Program the eight-stage placement sequence, with grip/release actions and collision-avoiding via points as needed.",
      "Define targets/configurations, tool/work-object data, motion types, speeds, zones and process I/O placeholders.",
      "Use J for one demanding configuration or motion segment. State its frame/dimensions; interpret speed amplification, rank or conditioning.",
      "Distinguish angular velocity from Euler/RPY angle rates.",
      "Complete one advanced challenge and integrate it into the same cell and program.",
      "Demonstrate the integrated cell with engineering evidence. Use one Lecture 10 case to explain an integration decision and remaining commissioning work."
    ],
    "fixed": [
      "ABB RAPID is the course exemplar; an equivalent selected-robot language is allowed",
      "Animation alone is not evidence of reach, limits or collision clearance"
    ],
    "whatif": "The animation looks correct, but the program uses an incorrect TCP or work-object frame. What happens at execution?",
    "evidence": [
      "Submit the integrated program/simulation and engineering evidence in the final report and demonstration.",
      "Final Engineering Report: 35 marks. Final Presentation & Demonstration: 40 marks."
    ],
    "lessons": [
      6,
      7,
      10
    ],
    "demos": [
      {
        "href": "quiz.html#q3",
        "label": "Quiz · Jacobian and singularity"
      },
      
    ],
    "review": "Stage 4 → Final Engineering Report 35 + Presentation/Demonstration 40",
    "source": [
      65,
      72
    ],
    "workflow": true,
    "specSection": "§4.4 · programming and integration"
  },
  {
    "tab": "Choose · Challenge",
    "phase": "ADVANCED ENGINEERING CHALLENGE · CHOOSE ONE",
    "title": "Choose one advanced challenge",
    "visual": "One extension in the same cell",
    "image": "assets/project-f3.png",
    "caption": "Figure 2 · fixed supply and assembly references; robot base and tool are team choices.",
    "decision": "Questions and tasks",
    "tasks": [],
    "fixed": [],
    "whatif": "The extra function works in isolation. What evidence shows that it is integrated into the assembly task?",
    "evidence": [
      "Choose A, B or C; define the client problem, analysis, design/program change, evidence and limitations.",
      "The challenge’s 10 marks are included in the existing totals: 5 in the report and 5 in the presentation/demonstration."
    ],
    "lessons": [
      8
    ],
    "demos": [],
    "review": "Choose one · Vision/calibration OR Force/compliance OR Collision-free planning",
    "source": [
      76,
      99
    ],
    "specSection": "§5 · choose one challenge"
  },
  {
    "tab": "Finish · Evidence",
    "phase": "FINAL REPORT, PRESENTATION AND DEMONSTRATION",
    "title": "Prepare the final submission",
    "visual": "Original tender and design-review process",
    "image": "assets/project-f4.png",
    "caption": "Figure 3 · tender and review process.",
    "decision": "Questions and tasks",
    "tasks": [
      "Report the concept, workcell, frames, DH/FK/IK, trajectories, Jacobian, program, selected challenge and integrated results.",
      "Upload organised, documented, runnable MATLAB/Python and simulation/program files before presenting.",
      "Write the report in the team’s own words. Include assumptions, limitations, contributions and an AI Use Declaration.",
      "Prepare about 15 minutes plus 3–5 minutes of questions. Three to six members may present; all must answer questions.",
      "Explain the design decisions, demonstrate the evidence and state what remains before commissioning."
    ],
    "fixed": [
      "Total: 100 = reviews 25 + report 35 + presentation/demonstration 40",
      "Quiz and the optional L9 laboratory add no marks to this group-project total"
    ],
    "whatif": "A reviewer changes one assumption or asks you to modify one target. Can the team explain and reproduce the result?",
    "evidence": [
      "Reviews 25 + Final Engineering Report 35 + Final Presentation/Demonstration 40 = 100 marks.",
      "Use the complete marking criteria in the Project Specification."
    ],
    "lessons": [
      10
    ],
    "demos": [
      {
        "href": "quiz.html",
        "label": "Quiz · check your understanding"
      }
    ],
    "review": "Engineering evidence, reproducible results and professional communication",
    "source": [
      100,
      152
    ],
    "specSection": "§§6–9 · tools, deliverables and assessment"
  }
];
  const challenges={
  "A": {
    "title": "Vision and robot calibration",
    "tasks": [
      "Client change: one part varies by ±40 mm in X/Y and ±15° in orientation.",
      "Define camera, robot-base, work-object, TCP and component frames.",
      "Separate intrinsics/distortion, object-pose estimation, robot–camera transform, TCP calibration and any fixture datum.",
      "Compose the measurement-to-TCP transform chain. For eye-in-hand, include the current flange pose and camera mount.",
      "Update pick poses for at least two part locations and run IK.",
      "Discuss localisation, distortion and calibration/TCP/fixture uncertainty at task height; pixel error alone does not establish robot-target accuracy."
    ],
    "fixed": [
      "Simulated measurements are acceptable",
      "A sophisticated image-processing algorithm is not required"
    ],
    "lessons": [
      8,
      2,
      4
    ],
    "demos": []
  },
  "B": {
    "title": "Force and compliance in assembly",
    "tasks": [
      "Client change: wheels are damaged during insertion. Why can pure position control create excessive contact force? Use F = KΔx.",
      "Select sensing, passive/active compliance or compliant tooling, and justify the combination.",
      "Define approach, contact detection, reduced-speed insertion, monitoring, success/fault and retreat.",
      "Set contact, success and excessive-force criteria; modify the control/program logic.",
      "Explain practical benefits, limits and implementation."
    ],
    "fixed": [
      "Specify reasonable contact, success and excessive-force criteria",
      "Modify the program/control logic; discuss practical limits"
    ],
    "lessons": [
      7,
      6
    ],
    "demos": [
      {
        "href": "quiz.html#q3",
        "label": "Quiz · joint action and Jacobian"
      }
    ]
  },
  "C": {
    "title": "Collision-free robot path planning",
    "tasks": [
      "Client change: a new fixture or obstacle blocks the transfer. Add its geometry and show why the old route fails.",
      "Create a collision-free route with justified via points or PRM/RRT.",
      "Check all robot links, tool/carried part, clearance, joint limits, orientation and singularity risk.",
      "Compare at least two paths or configurations and justify the choice.",
      "Demonstrate the validated route, then time-parameterise it."
    ],
    "fixed": [
      "L9 is optional support, not a compulsory detailed algorithm requirement",
      "Fully checked, justified via points remain an acceptable solution"
    ],
    "lessons": [
      9,
      4,
      5
    ],
    "demos": []
  }
};
  const lessons={
    1:{title:'Robot selection starts from the task',idea:'Reach is one constraint. Required approach direction, tooling load and configuration also matter.',points:['Use the actual robot variant, joint limits and manufacturer load information.','Payload includes the end-effector and carried part; load offset affects wrist loading.','Figure 2 fixes station references, not robot base or grasp points.'],example:'Decide how the robot approaches a wheel shaft before choosing the base position.',quiz:7},
    2:{title:'Frames and transformations',idea:'A point gives position. A frame also specifies orientation.',points:['R columns are the moving frame axes expressed in the reference frame.','The last column gives the moving origin position. Specify length units.','Convert work-object targets into the robot base frame before solving IK.'],math:'<sup>W</sup>T<sub>T</sub> = <sup>W</sup>T<sub>B</sub> <sup>B</sup>T<sub>F</sub> <sup>F</sup>T<sub>T</sub>',example:'Use the supplied assembly frame to transform an illustrative local point. This point is not a prescribed TCP target.',quiz:2,interactive:true},
    3:{title:'DH connects neighbouring joint frames',idea:'Each joint variable appears in its neighbouring-link transformation; the arm equation is their ordered product.',points:['State standard or modified DH and use it consistently.','For revolute joints θ varies; for prismatic joints d varies. Fixed offsets remain part of the model.','Check the reference pose, axis directions and more than one forward-kinematic configuration.'],math:'<sup>0</sup>T<sub>n</sub>(q) = <sup>0</sup>T<sub>1</sub>(q₁) ⋯ <sup>n−1</sup>T<sub>n</sub>(qₙ)',example:'A valid matrix does not prove that your physical frame assignment or calibrated zero is correct.',quiz:3},
    4:{title:'IK needs the correct target and configuration',idea:'Convert the desired TCP pose to a flange target using the actual tool transform.',points:['Use a solver compatible with the selected robot geometry.','An IK solution needs FK back-checking, joint-limit checks and a plausible configuration.','Endpoint solutions do not establish feasibility along the complete path.'],math:'<sup>B</sup>T<sub>F</sub> = <sup>B</sup>T<sub>T</sub> (<sup>F</sup>T<sub>T</sub>)⁻¹',example:'Keep a Puma 560 teaching exercise separate from evidence for a different selected robot.',quiz:7},
    5:{title:'Trajectory planning controls motion over time',idea:'Choose joint or Cartesian interpolation according to the operation, then check the entire motion.',points:['Joint interpolation does not prescribe a straight TCP path.','A Cartesian line needs a continuous feasible IK solution and the required orientation.','Grip and release need fine stops; blending needs adequate clearance. Inspect position, velocity and acceleration.'],math:'q(s) = (1 − s)q₀ + sq₁ &nbsp; or &nbsp; p(s) = (1 − s)p₀ + sp₁',example:'For wheel insertion, the controlled Cartesian approach follows the actual motor-shaft axis.',quiz:8},
    6:{title:'The industrial program makes the operation explicit',idea:'Targets, configuration, tool/work-object data, motion and I/O must describe the same physical task.',points:['ABB RAPID is the exemplar; the selected robot may use another language.','Approach, grip, retreat, transfer, insert/release and retreat need process actions as well as motion.','Declare and check all targets and data before treating a fragment as executable.'],example:'Lecture 6 example fragment; target and tool declarations are omitted.',code:'MODULE testPrg\n  PROC main()\n    MoveJ p10, v200, z50, tool1;\n    MoveL p20, v100, fine, tool1;\n  ENDPROC\nENDMODULE',slide:'RAPID: ABB’s Robot Programming Language',quiz:8},
    7:{title:'Jacobian, singularity and contact',idea:'The Jacobian relates joint rates to an instantaneous tool twist in a stated frame.',points:['State the dimensions, row order and reference frame of J.','Independent output directions depend on rank. Near a singularity, a requested motion may need large joint rates.','Angular velocity is not generally the vector of Euler/RPY angle rates. For contact, relate displacement error to stiffness.'],math:'[v; ω] = J(q) q̇ &nbsp;&nbsp; τ = Jᵀ w &nbsp;&nbsp; F = KΔx',example:'Analyse a demanding insertion or transfer configuration, rather than reporting a Jacobian without physical interpretation.',quiz:5},
    8:{title:'Vision measurements must become robot targets',idea:'Camera calibration, object pose estimation and robot–camera calibration describe different relationships.',points:['Pixel displacement has no single fixed millimetre scale without depth/calibration.','For a fixed camera, compose base-to-camera, camera-to-object and object-to-TCP grasp transforms.','For eye-in-hand, include the current base-to-flange pose and fixed camera mounting transform. Then convert TCP to flange and check IK.'],math:'<sup>B</sup>T<sub>T</sub> = <sup>B</sup>T<sub>C</sub> <sup>C</sup>T<sub>O</sub> <sup>O</sup>T<sub>T</sub>',example:'Simulated measurements are allowed in Challenge A. Pixel reprojection error alone does not establish robot-target accuracy in mm.',quiz:9},
    9:{title:'Path planning connects collision-free configurations',idea:'Find a feasible geometric route before assigning its execution timing.',points:['Include every robot link and the carried tool/part in collision reasoning.','Joint limits, orientation constraints, clearance and singularities matter along the route.','Justified via points or PRM/RRT can support Challenge C. Detailed algorithms are not required of every team.'],example:'L9 is optional. Compare at least two routes or configurations and justify the selected path.',quiz:7},
    10:{title:'Integration connects the model to the real cell',idea:'A convincing digital demonstration still needs calibration, process integration and commissioning checks.',points:['Use an industrial case to justify an existing project decision, such as OLP, inspection or calibrated sensing.','Separate model predictions, simulation results and physical measurements.','Explain remaining calibration, I/O, safety and commissioning work; WAAM, VLA training and AI agents are not extra project requirements.'],example:'A robot may repeat a displaced point precisely when the model and physical frames are misaligned.',quiz:10}
  };
  let stage=0,choice='A',workflowStep=0,timer=null;
  const workflowNames=['Home','Pick approach','Pick and grip','Pick retreat','Assembly approach','Assemble and release','Assembly retreat','Home'];
  const stop=()=>{if(timer!==null)clearInterval(timer);timer=null;};
  function effective(){return stage===5?{...stages[5],...challenges[choice],title:'Choose one advanced challenge',decision:challenges[choice].title}:stages[stage];}
  function render(){stop();const s=effective();$('brief-admin').hidden=stage!==0;$('phase').textContent=s.phase;$('stage-title').textContent=s.title;$('visual-title').textContent=s.visual;$('project-image').src=s.image;$('project-image').alt=s.caption;$('figure-caption').textContent=s.caption;$('decision').textContent=s.decision;$('tasks').innerHTML=s.tasks.map(t=>`<li>${escape(t)}</li>`).join('');$('fixed-data').innerHTML=s.fixed.map(t=>`<p>${escape(t)}</p>`).join('');$('whatif').textContent=s.whatif;$('review').textContent=`Step ${stage+1} / ${stages.length}`;$('evidence').innerHTML='<ul>'+s.evidence.map(t=>`<li>${escape(t)}</li>`).join('')+'</ul>';$('evidence').hidden=false;$('evidence-toggle').hidden=true;$('stage-source').textContent='Project Specification '+s.specSection;document.querySelector('.whatif').open=false;$('lesson-links').innerHTML=s.lessons.map(n=>`<button class="lesson-link" data-lesson="${n}"><span>L${n}</span><b>${escape(lessons[n].title)}</b></button>`).join('');$('demo-links').innerHTML=s.demos.map(d=>`<a class="demo-link" href="${d.href}" target="_blank" rel="noopener">${escape(d.label)} ↗</a>`).join('');$('visual-extra').replaceChildren();
    document.body.classList.toggle('project-brief',stage===0);$('brief-reach-panel').hidden=stage!==0;
    $('demonstrations').open=false;$('demonstrations').hidden=stage!==0&&!s.workflow&&!s.demos.length;
    $('brief-resources').hidden=false;
    if(stage===0){$('brief-reach-panel').append($('visual-extra'));window.BJTUProjectReach.mount($('visual-extra'));}
    else $('demo-content').prepend($('visual-extra'));
    $('challenge-selector').replaceChildren();

    if(s.workflow){workflowStep=0;$('visual-extra').innerHTML='<div class="workflow">'+workflowNames.map((t,i)=>`<button data-flow="${i}" class="${i===2||i===5?'contact':''}">${i+1} · ${escape(t)}</button>`).join('')+'</div><p class="workflow-note" id="workflow-status"></p><button class="workflow-play" id="workflow-play">Play sequence</button>';updateFlow();$('workflow-play').onclick=()=>{if(timer!==null){stop();$('workflow-play').textContent='Play sequence';return;}$('workflow-play').textContent='Pause';timer=setInterval(()=>{workflowStep=(workflowStep+1)%8;updateFlow();},1100);};}
    if(stage===5){const bar=document.createElement('div');bar.className='challenge-options';bar.innerHTML=['A','B','C'].map(k=>`<button data-challenge="${k}" class="${choice===k?'active':''}">Option ${k}</button>`).join('');$('challenge-selector').append(bar);}
    [...$('stages').children].forEach((b,i)=>{b.classList.toggle('active',i===stage);b.setAttribute('aria-current',i===stage?'step':'false');});$('prev').disabled=stage===0;$('next').disabled=stage===stages.length-1;history.replaceState(null,'',`#step-${stage}`);
  }
  function updateFlow(){document.querySelectorAll('[data-flow]').forEach((b,i)=>b.classList.toggle('active',i===workflowStep));const contact=workflowStep===2||workflowStep===5;$('workflow-status').textContent=`${workflowStep+1}. ${workflowNames[workflowStep]} · ${contact?'Fine stop for grip/release.':'Select motion and blending only after checking direction and clearance.'}`;}
  function change(n){stage=Math.max(0,Math.min(stages.length-1,n));render();window.scrollTo({top:0,behavior:'auto'});}
  function openLesson(n){const l=lessons[n];$('lesson-dialog').classList.toggle('frame-lesson',!!l.interactive);$('lesson-number').textContent=`LECTURE ${n} · SINGLE-PAGE CLASSROOM NOTE`;$('lesson-title').textContent=l.title;$('lesson-body').innerHTML=`<p class="lesson-lead">${escape(l.idea)}</p>${l.math?`<div class="formula">${l.math}</div>`:''}<div class="lesson-grid"><div><h3>Use it in the project</h3><ul>${l.points.map(p=>`<li>${escape(p)}</li>`).join('')}</ul></div><div class="knowledge-box ${l.interactive?'':'green'}">${l.interactive?'<div id="frame-lab"></div>':`<h3>Check the meaning</h3><p>${escape(l.example)}</p>${l.code?`<pre>${escape(l.code)}</pre>`:''}`}</div></div><div class="lesson-footer"><a href="quiz.html" target="_blank" rel="noopener">Open interactive Quiz ↗</a><a href="${ppt(n)}" target="_blank" rel="noopener">Full Lecture ${n} PDF ↗</a><span>Classroom summary; original slides retain the full content.</span></div>`;if(l.interactive){const equation=$('lesson-body').querySelector(':scope > .formula'),grid=$('lesson-body').querySelector('.lesson-grid');grid.classList.add('frame-lesson-grid');grid.firstElementChild.append(equation);frameLab();}$('lesson-dialog').showModal();}
  const fmt=n=>Math.abs(n)<1e-7?'0':Number(n.toFixed(2)).toString();
  function frameLab(){const R=M.rpy(0,0,90),p=[-800,650,300],A=M.pose(R,p);$('frame-lab').innerHTML='<h3>Fixed assembly frame → local point</h3><div class="frame-matrix-wrap"><div class="matrix-row"><span class="matrix-label"><sup>W</sup>T<sub>A</sub> =</span><span class="matrix">'+A.flat().map(v=>`<span>${fmt(v)}</span>`).join('')+'</span></div><p class="caption">Translation in mm; supplied assembly yaw = 90°. The robot base is not assumed to be the world frame.</p></div><div class="frame-offsets">'+['x','y','z'].map((k,i)=>`<div class="offset-control"><label for="point-${k}">${k}<sub>A</sub> (mm)</label><input id="point-number-${k}" aria-label="Local point ${k} numeric value" type="number" min="${i===2?0:-100}" max="100" step="10" value="${i===0?50:0}"><input id="point-${k}" aria-label="Local point ${k}" type="range" min="${i===2?0:-100}" max="100" step="10" value="${i===0?50:0}"></div>`).join('')+'</div><div id="point-result" aria-live="polite"></div><p class="caption">Illustrative local point, not a supplied grasp or TCP target. Assembly frame and all fixed brief data stay unchanged.</p>';$('frame-lab').querySelector('.matrix-label').remove();$('frame-lab').querySelector('h3').innerHTML='Assembly frame <sup>W</sup>T<sub>A</sub> · local point experiment';const vals=[50,0,0];function update(){const w=M.add(p,M.mul(R,vals));$('point-result').innerHTML=`p<sub>W</sub> = R p<sub>A</sub> + t<br><b>(${w.map(fmt).join(', ')}) mm</b>`;}['x','y','z'].forEach((k,i)=>{const number=$('point-number-'+k),slider=$('point-'+k);for(const input of[number,slider])input.oninput=()=>{if(input.value===''||!Number.isFinite(input.valueAsNumber))return;vals[i]=Math.max(i===2?0:-100,Math.min(100,input.valueAsNumber));if(input===slider)number.value=vals[i];slider.value=vals[i];update();};number.onchange=()=>number.value=vals[i];});update();}
  function specification(full){$('spec-title').textContent=full?'Full Project Specification':`${stages[stage].tab} · Original requirements`;$('source-info').innerHTML=`Source: <a href="../Project%20Materials/BJTU%20Robotics%20and%20Flexible%20Automation%20Project%20Specification.pdf" target="_blank" rel="noopener">Project Specification (PDF)</a>`;if(full)$('spec-body').innerHTML=source.documentHtml;else{const [a,b]=stages[stage].source;$('spec-body').innerHTML=Object.entries(source.paragraphs).filter(([i,t])=>t&&((Number(i)>=a&&Number(i)<=b)||(stage===1&&Number(i)>=25&&Number(i)<=38))).map(([,t])=>`<p>${escape(t)}</p>`).join('');}$('spec-dialog').showModal();}
  stages.forEach((s,i)=>{const b=document.createElement('button');b.textContent=s.tab;b.onclick=()=>change(i);$('stages').append(b);});
  document.addEventListener('click',e=>{const close=e.target.closest('[data-close]');if(close)$(close.dataset.close).close();const learn=e.target.closest('[data-lesson]');if(learn)openLesson(Number(learn.dataset.lesson));const option=e.target.closest('[data-challenge]');if(option){choice=option.dataset.challenge;render();}const flow=e.target.closest('[data-flow]');if(flow){stop();workflowStep=Number(flow.dataset.flow);updateFlow();$('workflow-play').textContent='Play sequence';}});
  $('evidence-toggle').onclick=()=>{const open=$('evidence').hidden;$('evidence').hidden=!open;$('evidence-toggle').setAttribute('aria-expanded',String(open));$('evidence-toggle').textContent=open?'Hide evidence requirements':'What evidence is needed?';};
  $('prev').onclick=()=>change(stage-1);$('next').onclick=()=>change(stage+1);$('spec-open').onclick=()=>specification(true);$('requirements-open').onclick=()=>specification(false);
  function enlarge(){const s=effective();$('large-figure').src=s.image;$('large-figure').alt=s.caption;$('large-figure-title').textContent=s.visual;$('figure-dialog').showModal();}
  $('figure-open').onclick=enlarge;$('project-image').onclick=enlarge;
  $('map-open').onclick=()=>{$('course-map').innerHTML=[['Concept → complete task poses','L1 + L2 → robot/base/tool choices and EOI'],['Kinematic model → physical checks','L3 → frames, DH, FK and PDR'],['Feasible configurations → complete trajectories','L4 + L5 → IK/FK checks, motion evidence and FDR'],['Executable cell → justified integration','L6 + L7 + L10 → industrial program, Jacobian and commissioning reasoning'],['Choose one advanced client change','A: L8 vision/calibration · B: L7 compliance · C: optional L9 path planning']].map(([a,b])=>`<div class="map-row"><b>${a}</b><p>${b}</p></div>`).join('');$('map-dialog').showModal();};
  document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||/INPUT|BUTTON|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='ArrowRight')change(stage+1);if(e.key==='ArrowLeft')change(stage-1);});
  const hash=location.hash.match(/^#step-([0-6])$/);stage=hash?Number(hash[1]):0;render();
})();
