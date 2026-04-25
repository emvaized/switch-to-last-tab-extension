# <img src="icon.png" height="27px"/> Switch to Last Tab

Fast and lightweight extension which allows to quickly switch to last accessed tab. 

- No complicated code for tab tracking, just pure and straightforward sorting on each call
- Works right after browser restart!
- Adds a toolbar button which switches to last tab on click
- Provides a keyboard hotkey (default: <kbd>Alt</kbd>+<kbd>Q</kbd>, change on `chrome://extensions/shortcuts` page)
- Shows a small badge when switched to previous tab, which will be removed once you switch to another tab (*can be disabled in settings*)
- Focuses last active tab on tab close (*can be disabled in settings*)

There are many extensions that do the same, but they use complex code, storing their own history of tabs. There's no need to reinvent the wheel, when your browser already does that.
This extension uses minimal code and only native functions to achieve the same result. 

This extension is based on [Last Tab Button](https://github.com/pruna00/lasttabbtn), which I adapted for Chrome, updated icon, optimized code and added few features which I missed.