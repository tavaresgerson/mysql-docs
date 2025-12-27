### 7.4.2 Diário de Erros

7.4.2.1 Configuração do Diário de Erros

7.4.2.2 Configuração Padrão do Destino do Diário de Erros

7.4.2.3 Campos de Eventos de Erro

7.4.2.4 Tipos de Filtragem do Diário de Erros

7.4.2.5 Filtragem do Diário de Erros Baseada em Prioridade (log\_filter\_internal)

7.4.2.6 Filtragem do Diário de Erros Baseada em Regras (log\_filter\_dragnet)

7.4.2.7 Registro de Erros no Formato JSON

7.4.2.8 Registro de Erros no Diário de Log do Sistema

7.4.2.9 Formato de Saída do Diário de Erros

7.4.2.10 Limpeza e Renomeação do Arquivo do Diário de Erros

Esta seção discute como configurar o servidor MySQL para o registro de mensagens de diagnóstico no diário de erros. Para informações sobre a seleção do conjunto de caracteres e idioma do erro, consulte a Seção 12.6, “Conjunto de Caracteres do Mensagem de Erro”, e a Seção 12.12, “Definindo o Idioma da Mensagem de Erro”.

O diário de erros contém um registro dos tempos de inicialização e desligamento do **mysqld**. Ele também contém mensagens de diagnóstico, como erros, avisos e notas que ocorrem durante a inicialização e o desligamento do servidor, e enquanto o servidor estiver em execução. Por exemplo, se o **mysqld** notar que uma tabela precisa ser verificada ou reparada automaticamente, ele escreve uma mensagem no diário de erros.

Dependendo da configuração do diário de erros, os erros também podem preencher a tabela `error\_log` do Schema de Desempenho, para fornecer uma interface SQL ao log e permitir que seu conteúdo seja pesquisado. Consulte a Seção 29.12.22.3, “A Tabela error\_log”.

Em alguns sistemas operacionais, o diário de erros contém uma traça de pilha se o **mysqld** sair anormalmente. A traça pode ser usada para determinar onde o **mysqld** saiu. Consulte a Seção 7.9, “Depuração do MySQL”.

Se usado para iniciar o **mysqld**, o **mysqld\_safe** pode escrever mensagens no diário de erros. Por exemplo, quando o **mysqld\_safe** nota uma saída anormal do **mysqld**, ele reinicia o **mysqld** e escreve uma mensagem `mysqld reiniciado` no diário de erros.

As seções a seguir discutem aspectos da configuração do registro de erros.