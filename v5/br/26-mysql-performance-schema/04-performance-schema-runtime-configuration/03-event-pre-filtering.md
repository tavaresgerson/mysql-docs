### 25.4.3 Pré-Filtragem de Eventos

A pré-filtragem é realizada pelo Performance Schema e tem um efeito global que se aplica a todos os usuários. A pré-filtragem pode ser aplicada tanto no estágio *producer* quanto no estágio *consumer* do processamento de *events*:

* Para configurar a pré-filtragem no estágio *producer*, várias tabelas podem ser usadas:

  + `setup_instruments` indica quais *instruments* estão disponíveis. Um *instrument* desabilitado nesta tabela não produz *events*, independentemente do conteúdo das outras tabelas *setup* relacionadas à produção. Um *instrument* habilitado nesta tabela tem permissão para produzir *events*, sujeito ao conteúdo das outras tabelas.

  + `setup_objects` controla se o Performance Schema monitora tabelas específicas e objetos de *stored program*.

  + `threads` indica se o *monitoring* está habilitado para cada *thread* do servidor.

  + `setup_actors` determina o estado inicial do *monitoring* para novas *foreground threads*.

* Para configurar a pré-filtragem no estágio *consumer*, modifique a tabela `setup_consumers`. Isso determina os destinos para os quais os *events* são enviados. A `setup_consumers` também afeta implicitamente a produção de *events*. Se um determinado *event* não for enviado a nenhum destino (não for consumido), o Performance Schema não o produz.

Modificações em qualquer uma dessas tabelas afetam o *monitoring* imediatamente, com algumas exceções:

* Modificações em alguns *instruments* na tabela `setup_instruments` são efetivas apenas na inicialização do servidor (*server startup*); alterá-los em tempo de execução (*runtime*) não tem efeito. Isso afeta primariamente *mutexes*, *conditions* e *rwlocks* no servidor, embora possa haver outros *instruments* para os quais isso seja verdade. Essa restrição foi removida a partir do MySQL 5.7.12.

* Modificações na tabela `setup_actors` afetam apenas *foreground threads* criadas após a modificação, e não *threads* existentes.

Ao alterar a configuração de *monitoring*, o Performance Schema não realiza *flush* nas *history tables*. *Events* já coletados permanecem nas tabelas *current-events* e *history* até serem substituídos por *events* mais recentes. Se você desabilitar *instruments*, talvez seja necessário esperar um pouco antes que os *events* associados a eles sejam substituídos por *events* mais recentes de interesse. Alternativamente, use `TRUNCATE TABLE` para esvaziar as *history tables*.

Após fazer alterações de instrumentação, você pode querer truncar as *summary tables*. Geralmente, o efeito é redefinir as colunas de resumo para 0 ou `NULL`, e não remover linhas. Isso permite limpar valores coletados e reiniciar a agregação. Isso pode ser útil, por exemplo, após fazer uma alteração de configuração em *runtime*. Exceções a esse comportamento de truncagem são observadas nas seções individuais das *summary tables*.

As seções a seguir descrevem como usar tabelas específicas para controlar a pré-filtragem do Performance Schema.