--- title: MySQL 8.4 Reference Manual :: 13.2.7 What Calendar Is Used By MySQL? url: https://dev.mysql.com/doc/refman/8.4/en/mysql-calendar.html order: 17 ---



### 13.2.7 What Calendar Is Used By MySQL?

MySQL uses what is known as a proleptic Gregorian calendar.

Every country that has switched from the Julian to the Gregorian calendar has had to discard at least ten days during the switch. To see how this works, consider the month of October 1582, when the first Julian-to-Gregorian switch occurred.

<table><col style="width: 14%"/><col style="width: 14%"/><col style="width: 14%"/><col style="width: 14%"/><col style="width: 14%"/><col style="width: 14%"/><col style="width: 14%"/><thead><tr> <th>Monday</th> <th>Tuesday</th> <th>Wednesday</th> <th>Thursday</th> <th>Friday</th> <th>Saturday</th> <th>Sunday</th> </tr></thead><tbody><tr> <th>1</th> <td>2</td> <td>3</td> <td>4</td> <td>15</td> <td>16</td> <td>17</td> </tr><tr> <th>18</th> <td>19</td> <td>20</td> <td>21</td> <td>22</td> <td>23</td> <td>24</td> </tr><tr> <th>25</th> <td>26</td> <td>27</td> <td>28</td> <td>29</td> <td>30</td> <td>31</td> </tr></tbody></table>

There are no dates between October 4 and October 15. This discontinuity is called the cutover. Any dates before the cutover are Julian, and any dates following the cutover are Gregorian. Dates during a cutover are nonexistent.

A calendar applied to dates when it was not actually in use is called proleptic. Thus, if we assume there was never a cutover and Gregorian rules always rule, we have a proleptic Gregorian calendar. This is what is used by MySQL, as is required by standard SQL. For this reason, dates prior to the cutover stored as MySQL `DATE` or `DATETIME` values must be adjusted to compensate for the difference. It is important to realize that the cutover did not occur at the same time in all countries, and that the later it happened, the more days were lost. For example, in Great Britain, it took place in 1752, when Wednesday September 2 was followed by Thursday September 14. Russia remained on the Julian calendar until 1918, losing 13 days in the process, and what is popularly referred to as its “October Revolution” occurred in November according to the Gregorian calendar.


