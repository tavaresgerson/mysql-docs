### 8.12.1 Fatores do sistema

Alguns fatores de nível de sistema podem afetar o desempenho de maneira significativa:

- Se você tiver RAM suficiente, poderá remover todos os dispositivos de troca. Alguns sistemas operacionais usam um dispositivo de troca em alguns contextos, mesmo que você tenha memória livre.

- Evite o bloqueio externo para tabelas `MyISAM`. O padrão é que o bloqueio externo seja desativado. As opções `--external-locking` e `--skip-external-locking` habilitam e desabilitam explicitamente o bloqueio externo.

  Desativar o bloqueio externo não afeta a funcionalidade do MySQL, desde que você esteja executando apenas um servidor. Lembre-se de desativar o servidor (ou bloquear e limpar as tabelas relevantes) antes de executar o **myisamchk**. Em alguns sistemas, é obrigatório desativar o bloqueio externo porque ele não funciona de qualquer maneira.

  O único caso em que você não pode desativar o bloqueio externo é quando você executa vários *servidores* MySQL (não clientes) no mesmo banco de dados, ou se você executar **myisamchk** para verificar (não reparar) uma tabela sem informar ao servidor para esvaziar e bloquear as tabelas primeiro. Observe que usar vários servidores MySQL para acessar os mesmos dados simultaneamente geralmente *não é* recomendado, exceto quando estiver usando o NDB Cluster.

  As instruções `LOCK TABLES` e `UNLOCK TABLES` usam bloqueio interno, então você pode usá-las mesmo se o bloqueio externo estiver desativado.
