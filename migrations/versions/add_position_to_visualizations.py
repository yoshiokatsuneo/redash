from alembic import op
import sqlalchemy as sa

revision = 'add_position_to_visualizations'
down_revision = '7205816877ec'  # Use the latest migration as down_revision

def upgrade():
    op.add_column('visualizations', sa.Column('position', sa.Integer(), nullable=True))
    
    # Set default position based on ID to maintain current order
    op.execute("""
    UPDATE visualizations
    SET position = id
    WHERE position IS NULL
    """)
    
    # Make position not nullable after setting default values
    op.alter_column('visualizations', 'position', nullable=False, server_default='0')

def downgrade():
    op.drop_column('visualizations', 'position')
