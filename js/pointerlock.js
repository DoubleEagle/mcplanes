$(document).ready(function() {
    $('body').click(function() {
        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
        if (havePointerLock) {
            var element = $('body')[0];
            element.requestPointerLock = element.requestPointerLock ||
                    element.mozRequestPointerLock ||
                    element.webkitRequestPointerLock;
            // Ask the browser to lock the pointer
            element.requestPointerLock();
            document.addEventListener('pointerlockerror', lockError, false);
            document.addEventListener('mozpointerlockerror', lockError, false);
            document.addEventListener('webkitpointerlockerror', lockError, false);
            function lockError(e) {
                console.log(e);
            }}
        else {
            instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

        }
    });
});
