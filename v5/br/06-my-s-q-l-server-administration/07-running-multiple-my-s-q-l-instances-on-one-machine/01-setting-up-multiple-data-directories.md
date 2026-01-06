### 5.7.1 Configurando diretórios de dados múltiplos

Cada instância do MySQL em uma máquina deve ter seu próprio diretório de dados. A localização é especificada usando a opção `--datadir=dir_name`.

Existem diferentes métodos para configurar um diretório de dados para uma nova instância:

- Crie um novo diretório de dados.
- Copie um diretório de dados existente.

A discussão a seguir fornece mais detalhes sobre cada método.

Aviso

Normalmente, você nunca deve ter dois servidores atualizando dados nos mesmos bancos de dados. Isso pode levar a surpresas desagradáveis se o seu sistema operacional não suportar o bloqueio de sistema sem falhas. Se (apesar deste aviso) você executar vários servidores usando o mesmo diretório de dados e eles tiverem o registro habilitado, você deve usar as opções apropriadas para especificar nomes de arquivos de log que sejam únicos para cada servidor. Caso contrário, os servidores tentam registrar em os mesmos arquivos.

Mesmo quando as precauções anteriores são observadas, esse tipo de configuração funciona apenas com tabelas `MyISAM` e `MERGE`, e não com nenhum dos outros motores de armazenamento. Além disso, esse aviso contra a compartilhamento de um diretório de dados entre servidores sempre se aplica em um ambiente NFS. Permitir que múltiplos servidores MySQL acessem um diretório de dados comum através do NFS é uma *ideia muito ruim*. O principal problema é que o NFS é o gargalo de velocidade. Ele não é feito para esse tipo de uso. Outro risco com o NFS é que você deve criar uma maneira de garantir que dois ou mais servidores não interfiram uns com os outros. Normalmente, o bloqueio de arquivos NFS é gerenciado pelo daemon `lockd`, mas, no momento, não há uma plataforma que realize o bloqueio de forma 100% confiável em todas as situações.

#### Crie um novo diretório de dados

Com esse método, o diretório de dados está no mesmo estado em que estava quando você instalou o MySQL pela primeira vez. Ele possui o conjunto padrão de contas do MySQL e nenhum dado do usuário.

No Unix, inicie o diretório de dados. Consulte Seção 2.9, “Configuração e teste pós-instalação”.

No Windows, o diretório de dados está incluído na distribuição do MySQL:

- As distribuições de arquivos compactados do MySQL para Windows contêm um diretório de dados não modificado. Você pode descompactar essa distribuição em um local temporário e, em seguida, copiá-la para o diretório `data` para onde você está configurando a nova instância.

- Os instaladores de pacotes MSI do Windows criam e configuram o diretório de dados que o servidor instalado usa, mas também criam um diretório de dados "modelo" intocado chamado `data` sob o diretório de instalação. Após uma instalação ter sido realizada usando um pacote MSI, o diretório de dados modelo pode ser copiado para configurar instâncias adicionais do MySQL.

#### Copiar um diretório de dados existente

Com esse método, todas as contas do MySQL ou dados de usuário presentes no diretório de dados são transferidos para o novo diretório de dados.

1. Pare a instância existente do MySQL usando o diretório de dados. Isso deve ser um desligamento limpo para que a instância limpe quaisquer alterações pendentes no disco.

2. Copie o diretório de dados para o local onde o novo diretório de dados deve estar.

3. Copie o arquivo de opção `my.cnf` ou `my.ini` usado pela instância existente. Isso serve como base para a nova instância.

4. Modifique o novo arquivo de opções para que quaisquer caminhos que se refiram ao diretório de dados original se refiram ao novo diretório de dados. Além disso, modifique quaisquer outras opções que devam ser únicas por instância, como o número da porta TCP/IP e os arquivos de log. Para uma lista de parâmetros que devem ser únicos por instância, consulte Seção 5.7, “Executando múltiplas instâncias do MySQL em uma máquina”.

5. Inicie a nova instância, dizendo-lhe para usar o novo arquivo de opção.
