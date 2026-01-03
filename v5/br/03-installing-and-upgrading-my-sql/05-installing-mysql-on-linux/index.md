## 2.5 Instalar o MySQL no Linux

O Linux suporta várias soluções diferentes para instalar o MySQL. Recomendamos que você use uma das distribuições da Oracle, para as quais estão disponíveis vários métodos de instalação.

Como alternativa, você pode usar o gerenciador de pacotes do seu sistema para baixar e instalar o MySQL automaticamente com pacotes dos repositórios de software nativo da sua distribuição Linux. Esses pacotes nativos geralmente estão várias versões atrás da versão atualmente disponível. Normalmente, você também não pode instalar versões de marcos de desenvolvimento (DMRs), pois essas versões geralmente não estão disponíveis nos repositórios nativos. Para obter mais informações sobre como usar os instaladores de pacotes nativos, consulte a Seção 2.5.8, “Instalando o MySQL no Linux a partir dos Repositórios de Software Nativo”.

::: info Nota
Para muitas instalações do Linux, você pode querer configurar o MySQL para ser iniciado automaticamente quando a máquina for ligada. Muitas das instalações de pacotes nativos realizam essa operação por você, mas para soluções de código-fonte, binários e RPM, você pode precisar configurá-la separadamente. O script necessário, **mysql.server**, pode ser encontrado no diretório `support-files` sob o diretório de instalação do MySQL ou em um repositório de código-fonte do MySQL. Você pode instalá-lo como `/etc/init.d/mysql` para inicialização e desligamento automáticos do MySQL. Veja a Seção 4.3.3, “mysql.server — Script de Inicialização do Servidor MySQL”.
:::
