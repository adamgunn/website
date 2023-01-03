/* 
============================================================
Theme buttons
============================================================
*/

const color_var_names = ['--bg-color', '--text-color'];
const root = document.documentElement;

// [background color, text color]
var saved_colors = [];
color_var_names.forEach((var_name, index) => {
    saved_colors[index] = localStorage.getItem(var_name) ?
        localStorage.getItem(var_name) : null;
})
if (saved_colors[0]) {
    saved_colors.forEach((color, index) => {
        root.style.setProperty(color_var_names[index], color);
    })
}