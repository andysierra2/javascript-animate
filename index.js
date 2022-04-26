document
  .querySelectorAll('.container > div')
  .forEach(box => box.addEventListener(('click'), addRemove)); // every node can add




function addRemove(e) { 
  const container = e.target.parentElement;
  const oldRects  = getRects(container);
  const nChildren = container.children.length;
  const animation = container.dataset.animationType;
  const duration  = parseInt(container.dataset.animationSpeed);

  if(e.ctrlKey) {
    animateNode(e.target, animation, duration, false).then(
      () => {
        if(nChildren>1 && e.target.parentElement === container) {
          container.removeChild(e.target);
          const newRects = getRects(container);
          animateOthers(oldRects, newRects, duration);
        }
      }
    );
  }
  else {
    const newBox = createBox(nChildren);
    e.target.after(newBox);

    const newRects = getRects(container);
    animateOthers(oldRects, newRects, duration);
    animateNode(newBox, animation, duration, true);
  }
}




function createBox(nChildren) {
  const newBox = document.createElement('div');
  switch(parseInt(Math.random()*(4-1)+1)) {
    case 1: newBox.style.width = "100px"; break;
    case 2: newBox.style.width = "150px"; break;
    case 3: newBox.style.width = "200px"; break;
  }
  newBox.addEventListener('click', addRemove);
  newBox.append(document.createTextNode((nChildren+1).toString())); // put a number
  return newBox;
}




function getRects(container) {
  const divs  = document.querySelectorAll('.container > div');
  const boxes = Array.from(divs).filter(box=>box.parentElement===container);

  return boxes.map(box => {
    const rect = box.getBoundingClientRect();
    return {
      element: box,
      x: rect.x,
      y: rect.y
    }
  });
}




function getAnimation(animation, isBegin) {
  switch(animation) {
    case 'grow': return [
      {transform: isBegin? 'scale(0)' : 'none'},
      {transform: isBegin? 'none' : 'scale(0)'}
    ];
    case 'fade': return [
      {opacity: isBegin? '0' : '1'},
      {opacity: isBegin? '1' : '0'}
    ];
    // ... add more keyframes as you want
  }
}




function animateNode(box, animation, duration, isBegin) {

  const spawn = new Animation( new KeyframeEffect(
    box,
    getAnimation(animation, isBegin),
    {
      duration: duration,
      easing:   'ease-'+(isBegin? 'out':'in')
    }
  ), document.timeline);

  spawn.play();

  return spawn.finished;  // Promise
}




function animateOthers(oldRects, newRects, duration) {
  for(const newRect of newRects) {
    const oldRect = oldRects.find(rect => newRect.element === rect.element);

    let moveX, moveY;
    if(oldRect) {
      moveX = oldRect.x - newRect.x;
      moveY = oldRect.y - newRect.y;
    }

    newRect.element.animate([
      {transform: `translate(${moveX}px, ${moveY}px)`},
      {transform: 'none'}
    ], {
      duration: duration,
      easing: 'ease-out'
    });
  }
}