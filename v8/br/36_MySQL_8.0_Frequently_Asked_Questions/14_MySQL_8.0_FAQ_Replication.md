## A.14 Perguntas frequentes sobre o MySQL 8.0: Replicação

Na seção a seguir, fornecemos respostas às perguntas mais frequentes sobre a replicação do MySQL.

A.14.1. A réplica precisa estar conectada à fonte o tempo todo?

A.14.2. Devo habilitar a rede em minha fonte e réplica para habilitar a replicação?

A.14.3. Como sei o quanto uma réplica está atrasada em relação à fonte? Em outras palavras, como sei a data da última declaração replicada pela réplica?

A.14.4. Como forçar a fonte a bloquear as atualizações até que a replica alcance o ritmo?

A.14.5. Quais problemas devo ter em mente ao configurar a replicação bidirecional?

A.14.6. Como posso usar a replicação para melhorar o desempenho do meu sistema?

A.14.7. O que devo fazer para preparar o código do cliente em minhas próprias aplicações para usar a replicação que melhora o desempenho?

A.14.8. Quando e quanto a replicação do MySQL pode melhorar o desempenho do meu sistema?

A.14.9. Como posso usar a replicação para fornecer redundância ou alta disponibilidade?

A.14.10. Como posso saber se um servidor de origem de replicação está usando o formato de registro binário baseado em declarações ou baseado em linhas?

A.14.11. Como faço para dizer a uma réplica que use a replicação baseada em linhas?

A.14.12. Como impedir que as instruções GRANT e REVOKE sejam replicadas para as máquinas replicadas?

A.14.13. A replicação funciona em sistemas operacionais mistos (por exemplo, a fonte é executada no Linux, enquanto as réplicas são executadas no macOS e no Windows)?

A.14.14. A replicação funciona em arquiteturas de hardware mistas (por exemplo, a fonte é executada em uma máquina de 64 bits, enquanto as réplicas são executadas em máquinas de 32 bits)?

<table border="0" style="width: 100%;"><colgroup><col/></colgroup><tbody><tr class="question"><td align="left" valign="top"><p><b>A.14.1.</b></p></td><td align="left" valign="top"><p>A réplica precisa estar conectada à fonte o tempo todo?</p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>Não, não é assim. A réplica pode ficar inativa ou desconectada por horas ou até dias, e depois se reconectar e recuperar as atualizações. Por exemplo, você pode configurar uma relação de fonte/réplica por meio de uma conexão dial-up, onde o link está disponível apenas de forma esporádica e por curtos períodos de tempo. Isso implica que, em qualquer momento, não é garantido que a réplica esteja sincronizada com a fonte, a menos que você tome algumas medidas especiais.</p><p>Para garantir que o catchup ocorra em uma replica que foi desconectada, você não deve remover arquivos de log binário da fonte que contenham informações que ainda não foram replicadas para as réplicas. A replicação assíncrona só pode funcionar se a replica puder continuar lendo o log binário a partir do ponto em que leu os eventos pela última vez.</p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.14.2.</b></p></td><td align="left" valign="top"><p>Devo habilitar a rede em minha fonte e réplica para habilitar a replicação?</p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>Sim, a rede deve estar habilitada no servidor de origem e na replica. Se a rede não estiver habilitada, a replica não poderá se conectar ao servidor de origem e transferir o log binário. Verifique se a variável de sistema [[PH_HTML_CODE_<code>SOURCE_POS_WAIT()</code>] não foi habilitada no arquivo de configuração de qualquer um dos servidores.</p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.14.3.</b></p></td><td align="left" valign="top"><p>Como sei o quanto uma réplica está atrasada em relação à fonte? Em outras palavras, como sei a data da última declaração replicada pela réplica?</p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>Verifique a coluna [[PH_HTML_CODE_<code>SOURCE_POS_WAIT()</code>] na saída de [[<code>SHOW REPLICA | SLAVE STATUS</code>]]. Veja a Seção 19.1.7.1, “Verificação do Status de Replicação”.</p><p>Quando o fio de SQL de replicação executa um evento lido da fonte, ele modifica seu próprio tempo para o timestamp do evento. (É por isso que [[<code>TIMESTAMP</code>]] é bem replicada.) Na coluna [[<code>Time</code>]] na saída de [[<code>SHOW PROCESSLIST</code>]], o número de segundos exibido para o fio de SQL de replicação é o número de segundos entre o timestamp do último evento replicado e o tempo real da máquina replica. Você pode usar isso para determinar a data do último evento replicado. Note que, se sua replica tiver sido desconectada da fonte por uma hora e, em seguida, se reconectar, você pode ver imediatamente grandes valores de [[<code>Time</code>]] como 3600 para o fio de SQL de replicação em [[<code>SHOW PROCESSLIST</code>]]. Isso ocorre porque a replica está executando instruções que têm uma idade de uma hora. Veja a Seção 19.2.3, “Fios de Replicação”.</p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.14.4.</b></p></td><td align="left" valign="top"><p>Como forçar a fonte a bloquear as atualizações até que a replica se atualize?</p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p>Utilize o procedimento a seguir:</p> <div class="orderedlist"> <ol class="orderedlist" type="1"><li class="listitem"><p>Na fonte, execute as seguintes declarações:</p><pre class="programlisting copytoclipboard language-sql">[[<code class="language-sql">mysql&gt; FLUSH TABLES WITH READ LOCK; mysql&gt; SHOW MASTER STATUS;</code>]]</pre><p>Registre as coordenadas de replicação (o nome e a posição do arquivo de log binário atual) a partir da saída da instrução [[<code>SHOW</code>]].</p></li><li class="listitem"><p>Na replicação, emita a seguinte declaração, onde os argumentos da função [[<code>SOURCE_POS_WAIT()</code>]] ou [[<code>Seconds_Behind_Master</code><code>SOURCE_POS_WAIT()</code>] são os valores das coordenadas de replicação obtidos na etapa anterior:</p><pre class="programlisting copytoclipboard language-sql"><code class="language-sql">mysql> SELECT MASTER_POS_WAIT('<em class="replaceable">log_name</em>",<em class="replaceable">log_pos</em>);

Como usar a replicação para melhorar o desempenho do meu sistema?
Como posso usar a replicação para fornecer redundância ou alta disponibilidade?
Como faço para saber se um servidor de fonte de replicação está usando o formato de log binário baseado em declarações ou baseado em linhas?
Como faço para fazer uma replica saber usar o formato de replicação baseado em linhas?
A replicação funciona em sistemas operacionais mistos (por exemplo, a fonte roda em Linux enquanto as réplicas rodam em macOS e Windows)?
A replicação funciona em arquiteturas de hardware mistas (por exemplo, a fonte roda em uma máquina de 64 bits enquanto as réplicas rodam em máquinas de 32 bits)?
