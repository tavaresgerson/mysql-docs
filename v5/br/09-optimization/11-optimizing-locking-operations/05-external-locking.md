### 8.11.5 Bloqueio Externo

O bloqueio externo é o uso do bloqueio do sistema de arquivos para gerenciar a concorrência por tabelas de banco de dados `MyISAM` por vários processos. O bloqueio externo é usado em situações em que um único processo, como o servidor MySQL, não pode ser assumido como o único processo que requer acesso às tabelas. Aqui estão alguns exemplos:

- Se você estiver executando vários servidores que utilizam o mesmo diretório de banco de dados (não recomendado), cada servidor deve ter o bloqueio externo habilitado.

- Se você usar **myisamchk** para realizar operações de manutenção de tabelas em tabelas `MyISAM`, você deve garantir que o servidor não esteja em execução ou que o servidor tenha o bloqueio externo habilitado para bloquear os arquivos das tabelas conforme necessário para coordenar com **myisamchk** para o acesso às tabelas. O mesmo vale para o uso de **myisampack** para compactar tabelas `MyISAM`.

  Se o servidor for executado com o bloqueio externo habilitado, você pode usar **myisamchk** a qualquer momento para operações de leitura, como verificar tabelas. Nesse caso, se o servidor tentar atualizar uma tabela que o **myisamchk** esteja usando, o servidor aguarda que o **myisamchk** termine antes de continuar.

  Se você usar **myisamchk** para operações de escrita, como reparar ou otimizar tabelas, ou se você usar **myisampack** para compactar tabelas, *você* *deve* sempre garantir que o servidor **mysqld** não esteja usando a tabela. Se você não parar o **mysqld**, pelo menos faça um **mysqladmin flush-tables** antes de executar **myisamchk**. Se o servidor e **myisamchk** acessarem as tabelas simultaneamente, *as tabelas podem ficar corrompidas*.

Com o bloqueio externo ativado, cada processo que requer acesso a uma tabela obtém um bloqueio do sistema de arquivos para os arquivos da tabela antes de prosseguir para acessar a tabela. Se todos os bloqueios necessários não puderem ser adquiridos, o processo é bloqueado de acessar a tabela até que os bloqueios possam ser obtidos (após o processo que atualmente detém os bloqueios liberá-los).

O bloqueio externo afeta o desempenho do servidor, pois o servidor às vezes precisa esperar por outros processos antes de poder acessar as tabelas.

O bloqueio externo não é necessário se você estiver executando um único servidor para acessar um diretório de dados específico (o que é o caso mais comum) e se nenhum outro programa, como **myisamchk**, precisar modificar as tabelas enquanto o servidor estiver em execução. Se você estiver lendo as tabelas apenas com outros programas, o bloqueio externo não é necessário, embora **myisamchk** possa emitir avisos se o servidor alterar as tabelas enquanto **myisamchk** as estiver lendo.

Com o bloqueio externo desativado, para usar o **myisamchk**, você deve interromper o servidor enquanto o **myisamchk** estiver sendo executado ou, caso contrário, bloquear e limpar as tabelas antes de executar o **myisamchk**. (Veja a Seção 8.12.1, “Fatores do Sistema”.) Para evitar essa exigência, use as instruções `CHECK TABLE` e `REPAIR TABLE` para verificar e reparar as tabelas `MyISAM`.

Para o **mysqld**, o bloqueio externo é controlado pelo valor da variável de sistema `skip_external_locking`. Quando essa variável é habilitada, o bloqueio externo é desativado e vice-versa. O bloqueio externo é desativado por padrão.

O uso do bloqueio externo pode ser controlado ao iniciar o servidor usando a opção `--external-locking` ou `--skip-external-locking`.

Se você usar a opção de bloqueio externo para habilitar atualizações em tabelas `MyISAM` de muitos processos MySQL, você deve garantir que as seguintes condições sejam atendidas:

- Não use o cache de consultas para consultas que utilizam tabelas que são atualizadas por outro processo.

- Não inicie o servidor com a variável de sistema `delay_key_write` definida como `ALL` ou use a opção de tabela `DELAY_KEY_WRITE=1` para quaisquer tabelas compartilhadas. Caso contrário, pode ocorrer corrupção de índice.

A maneira mais fácil de satisfazer essas condições é sempre usar `--external-locking` junto com `--delay-key-write=OFF` e `--query-cache-size=0`. (Isso não é feito por padrão porque, em muitas configurações, é útil ter uma mistura das opções anteriores.)
