
import robot from 'robotjs';
import screenshot from 'screenshot-desktop';

// Test RobotJS
console.log('Testing RobotJS...');
const screenSize = robot.getScreenSize();
console.log('Screen size:', screenSize);

console.log('Moving mouse to (100, 100)...');
robot.moveMouse(100, 100);
console.log('Mouse moved.');

// Test Screenshot
console.log('Testing Screen Capture...');
screenshot({ format: 'jpg' }).then((img: Buffer) => {
    console.log('Screen captured. Image size:', img.length + ' bytes');
    console.log('Verification Complete.');
}).catch((err: any) => {
    console.error('Screen capture failed:', err);
});
