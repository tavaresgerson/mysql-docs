### 8.12.2 Otimizando Disk I/O

Esta seção descreve maneiras de configurar dispositivos de armazenamento quando você pode dedicar hardware de armazenamento mais rápido e em maior quantidade ao servidor de Database. Para informações sobre como otimizar uma configuração `InnoDB` para melhorar o desempenho de I/O, consulte a Seção 8.5.8, “Otimizando InnoDB Disk I/O”.

*   Disk seeks são um enorme gargalo de desempenho. Este problema se torna mais aparente quando a quantidade de dados começa a crescer tanto que o caching eficaz se torna impossível. Para Databases grandes onde você acessa dados de forma mais ou menos aleatória, você pode ter certeza de que precisa de pelo menos um disk seek para ler e alguns disk seeks para escrever. Para minimizar esse problema, utilize discos com baixos tempos de seek.

*   Aumente o número de *disk spindles* disponíveis (e, assim, reduza a sobrecarga de seek) por meio de *symlinking* de arquivos para discos diferentes ou utilizando striping nos discos:

    *   Usando Symbolic Links

        Isso significa que, para tabelas `MyISAM`, você cria um symlink do arquivo de Index e dos arquivos de dados de sua localização usual no diretório de dados para outro disco (que também pode estar com striping). Isso melhora tanto os tempos de seek quanto de leitura, presumindo que o disco não esteja sendo usado para outras finalidades. Consulte a Seção 8.12.3, “Usando Symbolic Links”.

        Symbolic links não são suportados para uso com tabelas `InnoDB`. No entanto, é possível colocar os arquivos de dados e de log do `InnoDB` em discos físicos diferentes. Para mais informações, consulte a Seção 8.5.8, “Otimizando InnoDB Disk I/O”.

    *   Striping

        Striping significa que você tem muitos discos e coloca o primeiro bloco no primeiro disco, o segundo bloco no segundo disco, e o *`N`*-ésimo bloco no disco (`N MOD number_of_disks`), e assim por diante. Isso significa que, se o tamanho normal dos seus dados for menor que o *stripe size* (ou estiver perfeitamente alinhado), você obtém um desempenho muito melhor. Striping é muito dependente do sistema operacional e do *stripe size*, portanto, execute benchmarks em sua aplicação com diferentes *stripe sizes*. Consulte a Seção 8.13.2, “Usando Seus Próprios Benchmarks”.

        A diferença de velocidade para striping é *muito* dependente dos parâmetros. Dependendo de como você configura os parâmetros de striping e o número de discos, você pode obter diferenças medidas em ordens de magnitude. Você deve escolher otimizar para acesso aleatório ou sequencial.

*   Para confiabilidade, você pode querer usar RAID 0+1 (striping mais *mirroring*), mas, neste caso, você precisa de 2 × *`N`* drives para armazenar *`N`* drives de dados. Esta é provavelmente a melhor opção se você tiver recursos financeiros para ela. No entanto, você também pode precisar investir em algum software de gerenciamento de volume para lidar com isso de forma eficiente.

*   Uma boa opção é variar o RAID level de acordo com o quão crítico é um tipo de dado. Por exemplo, armazene dados semi-importantes que podem ser regenerados em um disco RAID 0, mas armazene dados realmente importantes, como informações de host e logs, em um disco RAID 0+1 ou RAID *`N`*. RAID *`N`* pode ser um problema se você tiver muitas operações de escrita (*writes*), devido ao tempo necessário para atualizar os bits de paridade.

*   Você também pode definir os parâmetros para o *file system* (sistema de arquivos) que o Database utiliza:

    Se você não precisa saber quando os arquivos foram acessados pela última vez (o que não é realmente útil em um Database server), você pode montar seus *file systems* com a opção `-o noatime`. Isso ignora as atualizações do tempo do último acesso nos *inodes* do *file system*, o que evita alguns disk seeks.

    Em muitos sistemas operacionais, você pode configurar um *file system* para ser atualizado de forma assíncrona, montando-o com a opção `-o async`. Se o seu computador for razoavelmente estável, isso deve proporcionar um melhor desempenho sem sacrificar muita confiabilidade. (Essa flag está ativada por padrão no Linux.)

#### Usando NFS com MySQL

Você deve ser cauteloso ao considerar o uso de NFS com MySQL. Os problemas potenciais, que variam conforme o sistema operacional e a versão do NFS, incluem o seguinte:

*   Arquivos de dados e de log do MySQL colocados em volumes NFS podem ficar travados (*locked*) e indisponíveis para uso. Problemas de Locking podem ocorrer em casos onde múltiplas instâncias do MySQL acessam o mesmo diretório de dados ou onde o MySQL é desligado incorretamente, devido a uma queda de energia, por exemplo. O NFS versão 4 aborda problemas de locking subjacentes com a introdução de *advisory* e *lease-based locking*. No entanto, o compartilhamento de um diretório de dados entre instâncias do MySQL não é recomendado.

*   Inconsistências de dados introduzidas devido a mensagens recebidas fora de ordem ou perda de tráfego de rede. Para evitar esse problema, use TCP com as opções de montagem `hard` e `intr`.

*   Limitações de tamanho máximo de arquivo. Clientes NFS Versão 2 podem acessar apenas os 2GB inferiores de um arquivo (*offset* assinado de 32 bits). Clientes NFS Versão 3 suportam arquivos maiores (*offsets* de até 64 bits). O tamanho máximo de arquivo suportado também depende do *file system* local do servidor NFS.

Usar NFS dentro de um ambiente SAN profissional ou outro sistema de armazenamento tende a oferecer maior confiabilidade do que usar NFS fora de tal ambiente. No entanto, NFS dentro de um ambiente SAN pode ser mais lento do que o armazenamento não rotacional diretamente anexado ou anexado por bus.

Se você optar por usar NFS, a Versão 4 ou posterior do NFS é recomendada, assim como testar minuciosamente sua configuração de NFS antes de implantá-la em um ambiente de produção.