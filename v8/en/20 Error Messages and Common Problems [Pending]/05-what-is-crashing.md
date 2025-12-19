### B.3.1 How to Determine What Is Causing a Problem

When you run into a problem, the first thing you should do is to find out which program or piece of equipment is causing it:

* If you have one of the following symptoms, then it is probably a hardware problems (such as memory, motherboard, CPU, or hard disk) or kernel problem:

  + The keyboard does not work. This can normally be checked by pressing the Caps Lock key. If the Caps Lock light does not change, you have to replace your keyboard. (Before doing this, you should try to restart your computer and check all cables to the keyboard.)
  + The mouse pointer does not move.
  + The machine does not answer to a remote machine's pings.
  + Other programs that are not related to MySQL do not behave correctly.
  + Your system restarted unexpectedly. (A faulty user-level program should never be able to take down your system.)

  In this case, you should start by checking all your cables and run some diagnostic tool to check your hardware! You should also check whether there are any patches, updates, or service packs for your operating system that could likely solve your problem. Check also that all your libraries (such as `glibc`) are up to date.

  It is always good to use a machine with ECC memory to discover memory problems early.
* If your keyboard is locked up, you may be able to recover by logging in to your machine from another machine and executing `kbd_mode -a`.
* Please examine your system log file (`/var/log/messages` or similar) for reasons for your problem. If you think the problem is in MySQL, you should also examine MySQL's log files. See  Section 7.4, “MySQL Server Logs”.
* If you do not think you have hardware problems, you should try to find out which program is causing problems. Try using **top**, **ps**, Task Manager, or some similar program, to check which program is taking all CPU or is locking the machine.
* Use **top**, **df**, or a similar program to check whether you are out of memory, disk space, file descriptors, or some other critical resource.
* If the problem is some runaway process, you can always try to kill it. If it does not want to die, there is probably a bug in the operating system.

If you have examined all other possibilities and concluded that the MySQL server or a MySQL client is causing the problem, it is time to create a bug report, see  Section 1.6, “How to Report Bugs or Problems”. In the bug report, try to give a complete description of how the system is behaving and what you think is happening. Also state why you think that MySQL is causing the problem. Take into consideration all the situations described in this chapter. State any problems exactly how they appear when you examine your system. Use the “copy and paste” method for any output and error messages from programs and log files.

Try to describe in detail which program is not working and all symptoms you see. We have in the past received many bug reports that state only “the system does not work.” This provides us with no information about what could be the problem.

If a program fails, it is always useful to know the following information:

* Has the program in question made a segmentation fault (did it dump core)?
* Is the program taking up all available CPU time? Check with **top**. Let the program run for a while, it may simply be evaluating something computationally intensive.
* If the  **mysqld** server is causing problems, can you get any response from it with  **mysqladmin -u root ping** or  **mysqladmin -u root processlist**?
* What does a client program say when you try to connect to the MySQL server? (Try with  **mysql**, for example.) Does the client jam? Do you get any output from the program?

When sending a bug report, you should follow the outline described in  Section 1.6, “How to Report Bugs or Problems”.


