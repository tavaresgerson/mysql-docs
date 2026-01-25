### 8.12.1 Fatores do Sistema

Alguns fatores no nível do sistema podem afetar o desempenho de maneira significativa:

* Se você tiver RAM suficiente, você pode remover todos os dispositivos de swap. Alguns sistemas operacionais usam um dispositivo de swap em alguns contextos, mesmo que você tenha memória livre.

* Evite o external locking (travamento externo) para tabelas `MyISAM`. Por padrão, o external locking é desabilitado. As opções `--external-locking` e `--skip-external-locking` ativam e desativam explicitamente o external locking.

  Desabilitar o external locking não afeta a funcionalidade do MySQL, contanto que você execute apenas um server. Apenas lembre-se de encerrar o server (ou aplicar lock e fazer flush nas tables relevantes) antes de executar o **myisamchk**. Em alguns sistemas, é obrigatório desabilitar o external locking porque ele não funciona, de qualquer maneira.

  O único caso em que você não pode desabilitar o external locking é quando você executa múltiplos *servers* MySQL (não clients) nos mesmos dados, ou se você executa o **myisamchk** para checar (não reparar) uma table sem antes instruir o server a fazer o flush e aplicar lock nas tables. Note que usar múltiplos servers MySQL para acessar os mesmos dados concorrentemente geralmente *não* é recomendado, exceto ao usar o NDB Cluster.

  As instruções `LOCK TABLES` e `UNLOCK TABLES` usam internal locking (travamento interno), então você pode usá-las mesmo que o external locking esteja desabilitado.