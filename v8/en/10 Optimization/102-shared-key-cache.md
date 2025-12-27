#### 10.10.2.1 Shared Key Cache Access

Threads can access key cache buffers simultaneously, subject to the following conditions:

* A buffer that is not being updated can be accessed by multiple sessions.
* A buffer that is being updated causes sessions that need to use it to wait until the update is complete.
* Multiple sessions can initiate requests that result in cache block replacements, as long as they do not interfere with each other (that is, as long as they need different index blocks, and thus cause different cache blocks to be replaced).

Shared access to the key cache enables the server to improve throughput significantly.
