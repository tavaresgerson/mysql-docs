## A.14 Perguntas Frequentes sobre a Replicação do MySQL 9.5:

Na seção a seguir, fornecemos respostas para as perguntas mais frequentes sobre a Replicação do MySQL.

A.14.1. A réplica precisa estar conectada à fonte o tempo todo?

A.14.2. Devo habilitar a rede na minha fonte e réplica para habilitar a replicação?

A.14.3. Como faço para saber quanto tempo a réplica está atrasada em relação à fonte? Em outras palavras, como faço para saber a data da última declaração replicada pela réplica?

A.14.4. Como faço para forçar a fonte a bloquear atualizações até que a réplica alcance o atraso?

A.14.5. Quais problemas devo estar ciente ao configurar a replicação bidirecional?

A.14.6. Como posso usar a replicação para melhorar o desempenho do meu sistema?

A.14.7. O que devo fazer para preparar o código do cliente em minhas próprias aplicações para usar a replicação que melhora o desempenho?

A.14.8. Quando e quanto a replicação do MySQL pode melhorar o desempenho do meu sistema?

A.14.9. Como posso usar a replicação para fornecer redundância ou alta disponibilidade?

A.14.10. Como faço para saber se um servidor de fonte de replicação está usando o formato de registro binário baseado em declaração ou baseado em linha?

A.14.11. Como faço para dizer a uma réplica que use a replicação baseada em linha?

A.14.12. Como faço para impedir que as declarações GRANT e REVOKE sejam replicadas para as máquinas da réplica?

A.14.13. A replicação funciona em sistemas operacionais mistos (por exemplo, a fonte executa no Linux enquanto as réplicas executam no macOS e no Windows)?

A.14.14. A replicação funciona em arquiteturas de hardware mistas (por exemplo, a fonte executa em uma máquina de 64 bits enquanto as réplicas executam em máquinas de 32 bits)?

<table border="0" style="width: 100%;"><colgroup><col align="left" width="1%"/><col/></colgroup><tbody><tr class="question"><td align="left" valign="top"><p><b>A.14.1.</b></p></td><td align="left" valign="top"><p><b>A</b>. É necessário que a replica esteja conectada à fonte o tempo todo? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Não, não é necessário. A replica pode ficar inativa ou desconectada por horas ou até dias, e depois se reconectar e recuperar as atualizações. Por exemplo, você pode configurar uma relação fonte/replica por meio de um link dial-up, onde o link está ativo apenas esporadicamente e por curtos períodos de tempo. A implicação disso é que, em qualquer momento, não é garantido que a replica esteja em sincronia com a fonte, a menos que você tome algumas medidas especiais.</p><p> Para garantir que a recuperação possa ocorrer para uma replica que foi desconectada, você não deve remover arquivos de log binário da fonte que contêm informações que ainda não foram replicadas para as réplicas. A replicação assíncrona só pode funcionar se a replica puder continuar lendo o log binário a partir do ponto em que leu os eventos pela última vez.</p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.14.3.</b></p></td><td align="left" valign="top"><p> Como faço para saber quanto tempo a replica está atrasada em relação à fonte? Em outras palavras, como faço para saber a data do último evento replicado pela replica? </p></td></tr><tr class="answer"><td align="left" valign="top"></td><td align="left" valign="top"><p> Verifique a coluna <code>Seconds_Behind_Master</code> na saída do comando <code>SHOW REPLICA | SLAVE STATUS</code>. Consulte Seção 19.1.7.1, “Checking Replication Status”. </p><p> Quando o thread de SQL de replicação executa uma leitura de eventos da fonte, ele modifica seu próprio tempo para o timestamp do evento. (É por isso que <code>TIMESTAMP</code> é bem replicado.) Na coluna <code>Time</code> na saída do comando <code>SHOW PROCESSLIST</code>, o número de segundos exibido para o thread de SQL de replicação é o número de segundos entre o timestamp do último evento replicado e o tempo real da máquina da replica. Você pode usar isso para determinar a data do último evento replicado. Note que, se sua replica estiver desconectada da fonte por uma hora e depois se reconectar, você pode ver imediatamente grandes valores de <code>Time</code>, como 3600 para o thread de SQL de replicação em <code>SHOW PROCESSLIST</code>. Isso ocorre porque a replica está executando declarações que têm uma idade de uma hora. Consulte Seção 19.2.3, “Replication Threads”. </p></td></tr><tr class="question"><td align="left" valign="top"><p><b>A.14.4.</b></p></td><td align

<div class="container">
  <div class="row">
    <div class="col-md-8">
      <h2>Perguntas Frequentes sobre Replicação</h2>
      <ul>
        <li><strong>A.14.1</strong>: Como configurar a replicação para que o MySQL 8.0.26:
          <pre class="programlisting copytoclipboard language-sql one-line"><code class="language-sql">mysql&gt; SELECT SOURCE_POS_WAIT('<em>log_name</em>>', '<em>log_pos</em>)';</code></pre><p> A declaração <code>SELECT</code> bloqueia a replica até que a replica atinja o arquivo de log especificado e a posição. Nesse ponto, a replica está em sincronia com a fonte e a declaração retorna. </p></li>
        <li><strong>A.14.2</strong>: Como habilitar a fonte para começar a processar atualizações novamente:
          <pre class="programlisting copytoclipboard language-sql one-line"><code class="language-sql">mysql&gt; UNLOCK TABLES;</code></pre></li>
        <li><strong>A.14.5</strong>: Quais problemas devo estar ciente ao configurar a replicação bidirecional?
          <p> A replicação atualmente não suporta nenhum protocolo de bloqueio entre a fonte e a replica para garantir a atomicidade de uma atualização distribuída (cross-server). Em outras palavras, é possível que o cliente A faça uma atualização para co-fonte 1, e, enquanto isso, antes de propagar para co-fonte 2, o cliente B pode fazer uma atualização para co-fonte 2 que faz a atualização do cliente A funcionar de maneira diferente do que em co-fonte 1. Assim, quando a atualização do cliente A chega em co-fonte 2, ela produz tabelas diferentes das que você tem em co-fonte 1, mesmo após todas as atualizações de co-fonte 2 também terem sido propagadas.</p>
        <li><strong>A.14.6</strong>: Como posso usar a replicação para melhorar o desempenho do meu sistema?
          <p> Configure uma fonte como fonte e direcione todos os escritos para ela. Em seguida, configure tantas réplicas quanto o orçamento e os racks permitirem, e distribua as leituras entre a fonte e as réplicas. Você também pode iniciar as réplicas com a opção <code>--skip-innodb</code> na opção, habilitar a variável de sistema <code>low_priority_updates</code> e definir a variável de sistema <code>delay_key_write</code> para <code>ALL</code> para obter melhorias de desempenho na replica no lado do cliente. Nesse caso, a replica usa tabelas <code>MyISAM</code> não transactionais em vez de tabelas <code>InnoDB</code> para obter mais velocidade ao eliminar o overhead transactionário. </p>
        <li><strong>A.14.7</strong>: O que devo fazer para preparar o código do cliente para usar a replicação de desempenho?
          <p> Veja o guia para usar a replicação como solução de escala, Seção 19.4.5, “Using Replication for Scale-Out”. </p>
        <li><strong>A.14.8</strong>: Quando e como a replicação pode melhorar o desempenho do meu sistema?
          <p> A replicação é mais benéfica para um sistema que processa leituras frequentes e atualizações infrequentes. Teoricamente, ao usar uma configuração fonte/múltiplas réplicas, você pode escalar o sistema adicionando mais réplicas até que você ou o limite de largura de banda da fonte não possam mais lidar com ele. </p>
          <p> Para determinar quanto você pode melhorar o desempenho do seu site com a replicação e quão você pode melhorar o desempenho do seu site, você deve conhecer seus padrões de consultas e determinar empiricamente comparando o throughput de leituras e escritas em um sistema típico fonte e um sistema típico replica.