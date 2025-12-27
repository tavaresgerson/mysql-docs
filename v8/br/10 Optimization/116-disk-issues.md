### 10.12.1 Otimização do I/O de Disco

Esta seção descreve maneiras de configurar dispositivos de armazenamento quando você pode dedicar mais e um hardware de armazenamento mais rápido ao servidor de banco de dados. Para obter informações sobre como otimizar uma configuração `InnoDB` para melhorar o desempenho de I/O, consulte a Seção 10.5.8, “Otimização do I/O de Disco de InnoDB”.

* Os buscas de disco são um grande gargalo de desempenho. Esse problema se torna mais evidente quando a quantidade de dados começa a crescer tanto que o cache efetivo se torna impossível. Para grandes bancos de dados onde você acessa os dados de forma mais ou menos aleatória, você pode ter certeza de que precisa de pelo menos uma busca de disco para ler e algumas buscas de disco para escrever. Para minimizar esse problema, use discos com tempos de busca baixos.
* Aumente o número de eixos de disco disponíveis (e, consequentemente, reduza o overhead de busca) usando symlinks para arquivos em diferentes discos ou estendendo os discos:

  + Usando symlinks

    Isso significa que, para tabelas `MyISAM`, você symlinks o arquivo de índice e os arquivos de dados de sua localização usual no diretório de dados para outro disco (que também pode ser estendido). Isso melhora tanto os tempos de busca quanto de leitura, assumindo que o disco não seja usado para outros propósitos também. Consulte a Seção 10.12.2, “Usando Symlinks”.

    Symlinks não são suportados para uso com tabelas `InnoDB`. No entanto, é possível colocar os arquivos de dados e log do `InnoDB` em diferentes discos físicos. Para mais informações, consulte a Seção 10.5.8, “Otimização do I/O de Disco de InnoDB”.
  + Estendendo

    Estender significa que você tem muitos discos e coloca o primeiro bloco no primeiro disco, o segundo bloco no segundo disco e o `N`-ésimo bloco no disco (`N MOD número_de_discos`), e assim por diante. Isso significa que, se o tamanho normal dos seus dados for menor que o tamanho do estender (ou perfeitamente alinhado), você obtém um desempenho muito melhor. Estender depende muito do sistema operacional e do tamanho do estender, então faça uma benchmark de sua aplicação com diferentes tamanhos de estender. Consulte a Seção 10.13.2, “Usando Suas Próprias Benchmark”.

A diferença de velocidade para striping é *muito* dependente dos parâmetros. Dependendo de como você configura os parâmetros de striping e o número de discos, você pode obter diferenças medidas em ordens de grandeza. Você precisa escolher se deseja otimizar para acesso aleatório ou sequencial.
* Para a confiabilidade, você pode querer usar RAID 0+1 (striping mais espelhamento), mas, nesse caso, você precisa de 2 × *`N`* discos para armazenar *`N`* discos de dados. Essa é provavelmente a melhor opção se você tiver dinheiro para isso. No entanto, você também pode precisar investir em algum software de gerenciamento de volume para lidar com isso de forma eficiente.
* Uma boa opção é variar o nível de RAID de acordo com a importância de um tipo de dado. Por exemplo, armazene dados semiimportantes que podem ser regenerados em um disco RAID 0, mas armazene dados realmente importantes, como informações do host e logs, em um disco RAID 0+1 ou RAID *`N`*. O RAID *`N`* pode ser um problema se você tiver muitas escritas, devido ao tempo necessário para atualizar os bits de paridade.
* Você também pode configurar os parâmetros do sistema de arquivos que a base de dados usa:

  Se você não precisa saber quando os arquivos foram acessados pela última vez (o que não é realmente útil em um servidor de banco de dados), você pode montar seus sistemas de arquivos com a opção `-o noatime`. Isso ignora as atualizações do último acesso nos inodes no sistema de arquivos, o que evita alguns buscas no disco.

  Em muitos sistemas operacionais, você pode configurar um sistema de arquivos para ser atualizado assincronicamente montando-o com a opção `-o async`. Se o seu computador estiver razoavelmente estável, isso deve lhe dar um melhor desempenho sem sacrificar muita confiabilidade. (Essa bandeira está ativada por padrão no Linux.)
#### Usando NFS com MySQL

Você deve ser cauteloso ao considerar se deve usar NFS com MySQL. Problemas potenciais, que variam de acordo com o sistema operacional e a versão do NFS, incluem os seguintes:

* Arquivos de dados e logs do MySQL colocados em volumes NFS ficando bloqueados e indisponíveis para uso. Problemas de bloqueio podem ocorrer em casos em que múltiplas instâncias do MySQL acessam o mesmo diretório de dados ou quando o MySQL é desligado de forma inadequada, devido a uma queda de energia, por exemplo. A versão 4 do NFS aborda problemas de bloqueio subjacentes com a introdução do bloqueio baseado em aconselhamento e arrendamento. No entanto, compartilhar um diretório de dados entre instâncias do MySQL não é recomendado.
* Inconsistências de dados introduzidas devido a mensagens recebidas fora de ordem ou tráfego de rede perdido. Para evitar esse problema, use o TCP com as opções de montagem `hard` e `intr`.
* Limitações de tamanho de arquivo máximo. Clientes da versão 2 do NFS podem acessar apenas os 2 GB mais baixos de um arquivo (deslocamento de 32 bits assinado). Clientes da versão 3 do NFS suportam arquivos maiores (até deslocamentos de 64 bits). O tamanho de arquivo máximo suportado também depende do sistema de arquivos local do servidor NFS.

Usar NFS dentro de um ambiente SAN profissional ou outro sistema de armazenamento tende a oferecer maior confiabilidade do que usar NFS fora de tal ambiente. No entanto, o NFS dentro de um ambiente SAN pode ser mais lento do que o armazenamento não rotativo diretamente conectado ou conectado em bus.

Se você optar por usar NFS, é recomendado o uso da versão 4 ou posterior do NFS, além de testar minuciosamente sua configuração do NFS antes de implementá-la em um ambiente de produção.