### 8.11.5 External Locking

External locking é o uso de bloqueio (locking) do sistema de arquivos para gerenciar a contenção (contention) por Tables de Database `MyISAM` por múltiplos processos. O External locking é usado em situações em que não se pode presumir que um único processo, como o MySQL Server, seja o único processo que requer acesso às Tables. Aqui estão alguns exemplos:

* Se você executa múltiplos Servers que usam o mesmo diretório de Database (não recomendado), cada Server deve ter o external locking habilitado.

* Se você usa o **myisamchk** para executar operações de manutenção de Table em tables `MyISAM`, você deve garantir que o Server não esteja em execução, ou que o Server tenha o external locking habilitado para que ele aplique Locks nos arquivos da Table conforme necessário, coordenando com o **myisamchk** para acesso às Tables. O mesmo é válido para o uso de **myisampack** para compactar Tables `MyISAM`.

  Se o Server for executado com o external locking habilitado, você pode usar o **myisamchk** a qualquer momento para operações de leitura, como a verificação de Tables. Neste caso, se o Server tentar atualizar uma Table que o **myisamchk** está usando, o Server aguardará o **myisamchk** finalizar antes de prosseguir.

  Se você usar o **myisamchk** para operações de escrita, como reparar ou otimizar Tables, ou se usar o **myisampack** para compactar Tables, você *deve* sempre garantir que o **mysqld** Server não esteja utilizando a Table. Se você não parar o **mysqld**, execute pelo menos um **mysqladmin flush-tables** antes de rodar o **myisamchk**. Suas Tables *podem ser corrompidas* se o Server e o **myisamchk** acessarem as Tables simultaneamente.

Com o external locking em vigor, cada processo que requer acesso a uma Table adquire um Lock de sistema de arquivos para os arquivos da Table antes de prosseguir com o acesso à Table. Se todos os Locks necessários não puderem ser adquiridos, o processo é impedido de acessar a Table até que os Locks possam ser obtidos (após o processo que atualmente detém os Locks os liberar).

O External locking afeta a performance do Server porque, às vezes, o Server precisa esperar por outros processos antes de poder acessar as Tables.

O External locking é desnecessário se você executa um único Server para acessar um determinado diretório de dados (o que é o caso usual) e se nenhum outro programa, como o **myisamchk**, precisar modificar Tables enquanto o Server estiver em execução. Se você apenas *ler* Tables com outros programas, o external locking não é obrigatório, embora o **myisamchk** possa relatar warnings se o Server alterar as Tables enquanto o **myisamchk** estiver lendo-as.

Com o external locking desabilitado, para usar o **myisamchk**, você deve parar o Server enquanto o **myisamchk** é executado ou então aplicar Lock e flush nas Tables antes de rodar o **myisamchk**. (Veja Seção 8.12.1, “System Factors.”) Para evitar essa exigência, use as instruções `CHECK TABLE` e `REPAIR TABLE` para verificar e reparar Tables `MyISAM`.

Para o **mysqld**, o external locking é controlado pelo valor da System Variable `skip_external_locking`. Quando essa variável está habilitada, o external locking é desabilitado, e vice-versa. O External locking é desabilitado por padrão.

O uso de external locking pode ser controlado na inicialização do Server usando a Option `--external-locking` ou `--skip-external-locking`.

Se você usar a Option external locking para habilitar atualizações em Tables `MyISAM` a partir de múltiplos processos MySQL, você deve garantir que as seguintes condições sejam satisfeitas:

* Não use o Query Cache para Queries que utilizam Tables que são atualizadas por outro processo.

* Não inicie o Server com a System Variable `delay_key_write` definida como `ALL` ou use a Option de Table `DELAY_KEY_WRITE=1` para quaisquer Tables compartilhadas. Caso contrário, pode ocorrer corrupção de Index.

A maneira mais fácil de satisfazer essas condições é usar sempre `--external-locking` juntamente com `--delay-key-write=OFF` e `--query-cache-size=0`. (Isso não é feito por padrão porque, em muitas configurações, é útil ter uma mistura das Options precedentes.)