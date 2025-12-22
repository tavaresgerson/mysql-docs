### 7.8.1 Criação de directórios de dados múltiplos

Cada instância MySQL em uma máquina deve ter seu próprio diretório de dados. A localização é especificada usando a opção `--datadir=dir_name`.

Existem diferentes métodos de criação de um diretório de dados para uma nova instância:

- Criar um novo diretório de dados.
- Copiar um diretório de dados existente.

A discussão a seguir fornece mais detalhes sobre cada método.

Advertência

Normalmente, você nunca deve ter dois servidores que atualizem dados nos mesmos bancos de dados. Isso pode levar a surpresas desagradáveis se seu sistema operacional não suportar o bloqueio do sistema sem falhas. Se (apesar deste aviso) você executar vários servidores usando o mesmo diretório de dados e eles tiverem o registro ativado, você deve usar as opções apropriadas para especificar nomes de arquivo de registro que sejam exclusivos de cada servidor. Caso contrário, os servidores tentam fazer login nos mesmos arquivos.

Mesmo quando as precauções precedentes são observadas, este tipo de configuração funciona apenas com tabelas `MyISAM` e `MERGE`, e não com qualquer dos outros motores de armazenamento. Além disso, este aviso contra o compartilhamento de um diretório de dados entre servidores sempre se aplica em um ambiente NFS. Permitir que vários servidores MySQL acessem um diretório de dados comum através do NFS é uma ideia muito ruim. O principal problema é que o NFS é o gargalo de velocidade. Não é destinado a tal uso. Outro risco com o NFS é que você deve conceber uma maneira de garantir que dois ou mais servidores não interfiram uns com os outros. Normalmente, o bloqueio de arquivos do NFS é gerenciado pelo demônio `lockd`, mas no momento não há nenhuma plataforma que faça o bloqueio 100% confiável em todas as situações.

#### Criar um novo diretório de dados

Com este método, o diretório de dados está no mesmo estado que quando você instala o MySQL pela primeira vez, e tem o conjunto padrão de contas MySQL e sem dados de usuário.

No Unix, inicializar o diretório de dados. Ver Secção 2.9, "Configuração e testes pós-instalação".

No Windows, o diretório de dados está incluído na distribuição MySQL:

- As distribuições de arquivo MySQL Zip para Windows contêm um diretório de dados não modificado. Você pode desembalar tal distribuição em um local temporário, e então copiá-lo diretório `data` para onde você está configurando a nova instância.
- Os instaladores de pacotes MSI do Windows criam e configuram o diretório de dados que o servidor instalado usa, mas também criam um diretório de dados template original chamado `data` sob o diretório de instalação. Depois que uma instalação foi realizada usando um pacote MSI, o diretório de dados do modelo pode ser copiado para configurar instâncias adicionais do MySQL.

#### Copiar um diretório de dados existente

Com este método, quaisquer contas MySQL ou dados de usuário presentes no diretório de dados são transferidos para o novo diretório de dados.

1. Parar a instância existente do MySQL usando o diretório de dados. Isto deve ser um desligamento limpo para que a instância limpe quaisquer alterações pendentes no disco.
2. Copiar o diretório de dados para o local onde o novo diretório de dados deve ser.
3. Copiar o arquivo de opção `my.cnf` ou `my.ini` usado pela instância existente. Isto serve como base para a nova instância.
4. Modifique o novo arquivo de opções para que qualquer nome de caminho que se refere ao diretório de dados original se refira ao novo diretório de dados. Também modifique quaisquer outras opções que devem ser únicas por instância, como o número de porta TCP / IP e os arquivos de log. Para uma lista de parâmetros que devem ser únicos por instância, consulte a Seção 7.8, "Executar múltiplas instâncias do MySQL em uma máquina".
5. Iniciar a nova instância, dizendo-lhe para usar o novo arquivo de opção.
