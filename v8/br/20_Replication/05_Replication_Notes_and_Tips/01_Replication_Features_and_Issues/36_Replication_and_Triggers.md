#### 19.5.1.36 Replicação e gatilhos

Com a replicação baseada em declarações, os gatilhos executados na fonte também são executados na replica. Com a replicação baseada em linhas, os gatilhos executados na fonte não são executados na replica. Em vez disso, as alterações de linha na fonte resultantes da execução do gatilho são replicadas e aplicadas na replica.

Esse comportamento é intencional. Se, na replicação baseada em linhas, a replica aplicasse os gatilhos, bem como as alterações de linha causadas por eles, as alterações seriam aplicadas duas vezes na replica, levando a dados diferentes na fonte e na replica.

Se você deseja que os gatilhos sejam executados tanto na fonte quanto na replica, talvez porque você tenha gatilhos diferentes na fonte e na replica, você deve usar a replicação baseada em declarações. No entanto, para habilitar gatilhos no lado da replica, não é necessário usar exclusivamente a replicação baseada em declarações. É suficiente alternar para a replicação baseada em declarações apenas para aquelas declarações onde você deseja esse efeito e usar a replicação baseada em linhas o resto do tempo.

Uma declaração que invoca um gatilho (ou função) que causa uma atualização em uma coluna `AUTO_INCREMENT` não é replicada corretamente usando a replicação baseada em declarações. O MySQL 8.0 marca tais declarações como inseguras. (Bug #45677)

Um gatilho pode ter gatilhos para diferentes combinações de evento de gatilho (`INSERT`, `UPDATE`, `DELETE`) e tempo de ação (`BEFORE`, `AFTER`), e múltiplos gatilhos são permitidos.

Por simplicidade, “múltiplos gatilhos” aqui é uma abreviação para “múltiplos gatilhos que têm o mesmo evento de gatilho e tempo de ação”.

**Atualizações.** Múltiplos gatilhos não são suportados em versões anteriores ao MySQL 5.7. Se você atualizar servidores em uma topologia de replicação que utilizam uma versão anterior ao MySQL 5.7, atualize primeiro as réplicas e, em seguida, o servidor de origem. Se um servidor de origem de replicação atualizado ainda tiver réplicas antigas usando versões do MySQL que não suportam múltiplos gatilhos, ocorrerá um erro nessas réplicas se um gatilho for criado na origem para uma tabela que já possui um gatilho com o mesmo evento de gatilho e hora de ação.

**Reduções de nível.** Se você reduzir o nível de um servidor que suporta múltiplos gatilhos para uma versão mais antiga que não o faz, a redução terá esses efeitos:

- Para cada tabela que possui gatilhos, todas as definições de gatilho estão no arquivo `.TRG` da tabela. No entanto, se houver vários gatilhos com o mesmo evento de gatilho e hora de ação, o servidor executa apenas um deles quando o evento de gatilho ocorre. Para obter informações sobre os arquivos `.TRG`, consulte a seção Armazenamento de Gatilhos de Tabela da documentação do MySQL Server Doxygen, disponível em <https://dev.mysql.com/doc/index-other.html>.

- Se forem adicionados ou removidos gatilhos da tabela após a redução, o servidor reescreve o arquivo `.TRG` da tabela. O arquivo reescrito retém apenas um gatilho por combinação de evento do gatilho e hora da ação; os outros são perdidos.

Para evitar esses problemas, modifique seus gatilhos antes de fazer a atualização para uma versão anterior. Para cada tabela que tenha múltiplos gatilhos por combinação de evento do gatilho e hora da ação, converta cada conjunto desses gatilhos em um único gatilho da seguinte forma:

1. Para cada gatilho, crie uma rotina armazenada que contenha todo o código do gatilho. Os valores acessados usando `NEW` e `OLD` podem ser passados para a rotina usando parâmetros. Se o gatilho precisar de um único valor de resultado do código, você pode colocar o código em uma função armazenada e fazer a função retornar o valor. Se o gatilho precisar de múltiplos valores de resultado do código, você pode colocar o código em um procedimento armazenado e retornar os valores usando os parâmetros `OUT`.

2. Desmarque todos os gatilhos da tabela.

3. Crie um novo gatilho para a tabela que invoca as rotinas armazenadas que foram criadas. O efeito deste gatilho é, portanto, o mesmo que os múltiplos gatilhos que ele substitui.
