### 19.5.3 Atualização ou Desatualização de uma Topologia de Replicação

Ao atualizar servidores que participam de uma topologia de replicação, é necessário levar em consideração o papel de cada servidor na topologia e estar atento a problemas específicos da replicação. Para obter informações gerais e instruções para atualizar uma instância do Servidor MySQL, consulte o Capítulo 3, *Atualização do MySQL*.

Como explicado na Seção 19.5.2, “Compatibilidade de Replicação entre Versões do MySQL”, o MySQL suporta a replicação de uma versão mais antiga para uma replica mais recente para combinações de versões onde suportamos atualizações da versão da fonte para a versão da replica, conforme descrito na Seção 1.3, “Lançamentos do MySQL: Inovação e LTS” e na Seção 3.2, “Caminhos de Atualização”, mas não suporta replicação de uma fonte executando uma versão mais recente para uma replica executando uma versão mais antiga. Uma replica em uma versão mais antiga pode não ter a capacidade necessária para processar transações que podem ser tratadas pela fonte em uma versão mais recente. Portanto, é necessário atualizar todas as réplicas em uma topologia de replicação para a versão do Servidor MySQL alvo antes de atualizar o servidor fonte para a versão alvo. Dessa forma, você nunca estará na situação em que uma replica ainda na versão mais antiga esteja tentando processar transações de uma fonte na versão mais recente.

Em uma topologia de replicação com múltiplas fontes (replicação multi-fonte), o uso de mais de duas versões do Servidor MySQL não é suportado, independentemente do número de servidores MySQL fonte ou replica. Por exemplo, você não pode usar MySQL X.Y.1, MySQL X.Y.2 e MySQL X.Y.3 simultaneamente em uma configuração desse tipo, embora possa usar qualquer uma dessas versões juntas.

#### Verifique os Servidores antes da Atualização

É possível encontrar dificuldades de replicação ao replicar de uma fonte de uma versão anterior que ainda não foi atualizada para uma réplica de uma versão posterior que foi atualizada. Isso pode acontecer se a fonte usar declarações ou depender de comportamentos que não são mais suportados na versão posterior instalada na réplica. Você pode usar o utilitário de verificação de atualização do MySQL Shell `util.checkForServerUpgrade()` para verificar as instâncias do servidor MySQL 8.0 para atualização para uma versão MySQL 8.4. Esse utilitário identifica configurações e dados armazenados que são conhecidos por potencialmente causar problemas de atualização, incluindo recursos e comportamentos que não estão mais disponíveis na versão posterior. Consulte o utilitário de verificação de atualização para obter informações sobre o utilitário de verificação de atualização.

#### Procedimento de Atualização Padrão

Para atualizar uma topologia de replicação, siga as instruções no Capítulo 3, *Atualizando o MySQL* para cada instância individual do Servidor MySQL, usando este procedimento geral:

1. Atualize as réplicas primeiro. Em cada instância de réplica:

   * Realize os verificações preliminares e os passos descritos na Seção 3.6, “Preparando Sua Instalação para Atualização”.

   * Desligue o Servidor MySQL.
   * Atualize os binários ou pacotes do Servidor MySQL.
   * Reinicie o Servidor MySQL.
   * O Servidor MySQL executa todo o procedimento de atualização do MySQL automaticamente, desabilitando o registro binário durante a atualização.

   * Reinicie a replicação usando um `START REPLICA`.

2. Se houver várias camadas de réplicas (réplicas-de-réplicas), comece atualizando as réplicas que estão mais distantes da fonte, realizando a atualização de forma ascendente.

3. Quando todas as réplicas tiverem sido atualizadas e apenas a fonte permanecer, realize uma transição para uma das réplicas. Em outras palavras, pare as atualizações do cliente na fonte, espere pelo menos que uma réplica aplique todas as alterações, reconfigure a topologia de replicação para que a réplica se torne a fonte e que a fonte seja deixada fora da topologia de replicação. Atualize a fonte antiga de acordo com o procedimento para um único servidor e, em seguida, reinserta-a na topologia.

Se você precisar fazer um downgrade dos servidores em uma topologia de replicação, a fonte deve ser atualizada antes de as réplicas serem atualizadas. Nas réplicas, você deve garantir que o log binário e o log de retransmissão tenham sido processados completamente e exclua-os antes de prosseguir com o downgrade.

##### Procedimento de Downgrade Rolling

1. Pare as atualizações.
2. Aguarde que as réplicas recebam todas as atualizações. Não é necessário esperar que elas apliquem todas as alterações. Se elas não aplicaram todas as alterações, deixe o aplicativo delas rodando para que possam processar as transações recebidas em segundo plano.

3. Atualize o servidor fonte, seguindo as instruções para o downgrade de um único servidor.

4. Reinserte o servidor fonte atualizado na topologia.
5. Permita as atualizações novamente.
6. Aguarde até que todas as réplicas tenham aplicado todas as transações restantes do primário anterior.

7. Para cada réplica, remova a réplica da topologia, espere que ela aplique todo o seu log de retransmissão, atualize-a seguindo as instruções para o downgrade de um único servidor e reinserta-a na topologia. Se houver vários níveis de réplicas (réplicas-de-réplicas), faça o downgrade de cima para baixo, começando com as réplicas mais próximas do servidor fonte.