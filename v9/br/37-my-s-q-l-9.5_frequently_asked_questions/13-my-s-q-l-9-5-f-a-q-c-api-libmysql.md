## A.13 FAQ do MySQL 9.5: API C, libmysql

Perguntas frequentes sobre a API C do MySQL e a libmysql.

A.13.1. O que é a “API C Native do MySQL”? Quais são os benefícios e casos de uso típicos?

A.13.2. Qual versão da libmysql devo usar?

A.13.3. E se eu quiser usar a X DevAPI “NoSQL”?

A.13.4. Como faço para baixar a libmysql?

A.13.5. Onde está a documentação?

A.13.6. Como faço para relatar bugs?

A.13.7. É possível compilar a biblioteca por conta própria?

<table> border="0" style="width: 100%;"><colgroup><col align="left" width="1%"/><col/></colgroup><tbody><tr class="question"><td align="left" valign="top"><p><b>A.13.1.</b></p></td><td align="left" valign="top"><p><b>A.13.1.1.</b></p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> O que é <span class="quote">“<span class="quote">MySQL Native C API</span>”</span>? Quais são os benefícios típicos e os casos de uso? </p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.13.2.</b></p></td><td align="left" valign="top"><p> Qual versão do libmysql devo usar? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Para MySQL 9.1, recomendamos o libmysql 9.1. </p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.13.3.</b></p></td><td align="left" valign="top"><p> E se eu quiser usar o <span class="quote">“<span class="quote">NoSQL</span>”</span> X DevAPI? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Para C e o X DevApi Document Store para MySQL, recomendamos o MySQL Connector/C++. O Connector/C++ tem cabeçalhos C compatíveis. (Isso não se aplica a MySQL 5.7 ou versões anteriores.) </p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.13.4.</b></p></td><td align="left" valign="top"><p> Como eu faço para baixar o libmysql? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Linux: O Client Utilities Package está disponível na página de download do MySQL Community Server.</p></li><li class="listitem"><p> Repos: O Client Utilities Package está disponível nos repositórios Yum, APT, SuSE.</p></li><li class="listitem"><p> Windows: O Client Utilities Package está disponível no Windows Installer.</p></li></ul> </div> </td></tr><tr class="question"><td align="left" valign="top"><p><b>A.13.5.</b></p></td><td align="left" valign="top"><p> Onde está a documentação? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Veja o <a class="ulink" href="/doc